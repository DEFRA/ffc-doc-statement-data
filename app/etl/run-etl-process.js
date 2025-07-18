const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const config = require('../config')
const dbConfig = config.dbConfig[config.env]
const storage = require('../storage')
const db = require('../data')
const tableMappings = require('../constants/table-mappings')
const { getFirstLineNumber } = require('./file-utils')

const runEtlProcess = async ({
  fileStream,
  columns,
  table,
  mapping,
  transformer,
  nonProdTransformer,
  excludedFields,
  file
}, maxRetries = 3, baseDelay = 500) => {
  let attempt = 0
  const etlContext = await prepareEtlContext({ table, fileStream, file })

  while (attempt <= maxRetries) {
    try {
      const freshFileStream = await storage.downloadFileAsStream(file)

      const result = await runEtlFlow({
        etlContext,
        columns,
        mapping,
        table,
        transformer,
        nonProdTransformer,
        excludedFields,
        freshFileStream,
        file
      })

      return result
    } catch (error) {
      attempt++
      if (attempt > maxRetries) {
        console.error(`ETL process failed after ${maxRetries} retries: ${error.message}`)
        throw error
      }

      const delay = baseDelay * 2 ** (attempt - 1)
      console.warn(`Retrying ETL process (attempt ${attempt} of ${maxRetries}) after ${delay}ms due to error: ${error.message}`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  return true
}

async function prepareEtlContext ({ table, fileStream, file }) {
  console.log('Preparing ETL context for table:', table)
  const sequelizeModelName = tableMappings[table]
  const initialRowCount = await db[sequelizeModelName]?.count()
  const idFrom = (await db[sequelizeModelName]?.max('etlId') ?? 0) + 1
  const rowCount = await getFirstLineNumber(fileStream)
  const fileInProcess = await db.etlStageLog.create({ file, rowCount })
  return { sequelizeModelName, initialRowCount, idFrom, fileInProcess }
}

function runEtlFlow ({
  etlContext,
  columns,
  mapping,
  table,
  transformer,
  nonProdTransformer,
  excludedFields,
  freshFileStream,
  file
}) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const etl = new Etl.Etl()
        const etlFlow = etl
          .connection(await new Connections.ProvidedConnection({
            name: 'postgresConnection',
            sequelize: db.sequelize
          }))
          .loader(new Loaders.CSVLoader({
            stream: freshFileStream,
            columns,
            startingLine: 3,
            relax: true
          }))

        if (nonProdTransformer && config.etlConfig.fakeData) {
          etlFlow.transform(new Transformers.FakerTransformer({
            columns: nonProdTransformer,
            locale: 'en_GB'
          }))
        }

        if (transformer) {
          etlFlow.transform(new Transformers.StringReplaceTransformer(transformer))
        }

        etlFlow
          .destination(new Destinations.PostgresDestination({
            table,
            connection: 'postgresConnection',
            mapping,
            includeErrors: false,
            schema: dbConfig.schema,
            ignoredColumns: excludedFields
          }))
          .pump()
          .on('result', async (data) => {
            await handleEtlResult({
              etlContext,
              file,
              table
            })
            return resolve(data)
          })
          .on('error', (error) => {
            console.error('ETL Error:', error.message)
            return reject(error)
          })
      } catch (e) {
        console.error('ETL Initialization Error:', e.message)
        reject(e)
      }
    })()
  })
}

async function handleEtlResult ({ etlContext, file }) {
  const { sequelizeModelName, initialRowCount, idFrom, fileInProcess } = etlContext
  const newRowCount = await db[sequelizeModelName]?.count()
  const idTo = await db[sequelizeModelName]?.max('etlId') ?? 0
  await db.etlStageLog.update(
    {
      rowsLoadedCount: newRowCount - initialRowCount,
      idTo,
      idFrom: idFrom < idTo ? idFrom : idTo,
      endedAt: new Date()
    },
    { where: { etlId: fileInProcess.etlId } }
  )
}

module.exports = {
  runEtlProcess
}
