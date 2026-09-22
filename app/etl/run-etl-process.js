const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const config = require('../config')
const dbConfig = config.dbConfig[config.env]
const storage = require('../storage')
const db = require('../database')
const tableMappings = require('../constants/table-mappings')
const { getFirstLineNumber } = require('./file-utils')
const publishEtlProcessError = require('../messaging/publish-etl-process-error')

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

const countRows = async (accessorName) => {
  if (!db[accessorName]) {
    return undefined
  }
  const { count } = await db[accessorName]().count({ count: '*' }).first()
  return Number(count)
}

const maxEtlId = async (accessorName) => {
  if (!db[accessorName]) {
    return 0
  }
  const { max } = await db[accessorName]().max({ max: 'etlId' }).first()
  return max ?? 0
}

async function prepareEtlContext ({ table, fileStream, file }) {
  console.log('Preparing ETL context for table:', table)
  const tableAccessorName = tableMappings[table]
  const initialRowCount = await countRows(tableAccessorName)
  const idFrom = (await maxEtlId(tableAccessorName)) + 1
  const rowCount = await getFirstLineNumber(fileStream)
  const [fileInProcess] = await db.etlStageLog().insert({ file, rowCount }).returning(['etlId'])
  return { tableAccessorName, initialRowCount, idFrom, fileInProcess }
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
          .connection(await Connections.ProvidedConnection({
            name: 'postgresConnection',
            // ffc-pay-etl-framework's PostgresDestination only ever calls `.query(sql)`
            // on this connection, so a thin adapter over the knex client is enough -
            // it does not need to be a real Sequelize instance.
            sequelize: { query: (sql) => db.client.raw(sql) }
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
        console.error('ETL process exception:', e)
        await publishEtlProcessError(file, e)
        reject(e)
      }
    })()
  })
}

async function handleEtlResult ({ etlContext, file }) {
  const { tableAccessorName, initialRowCount, idFrom, fileInProcess } = etlContext
  const newRowCount = await countRows(tableAccessorName)
  const idTo = await maxEtlId(tableAccessorName)
  await db.etlStageLog().where({ etlId: fileInProcess.etlId }).update({
    rowsLoadedCount: newRowCount - initialRowCount,
    idTo,
    idFrom: idFrom < idTo ? idFrom : idTo,
    endedAt: new Date()
  })
}

module.exports = {
  runEtlProcess
}
