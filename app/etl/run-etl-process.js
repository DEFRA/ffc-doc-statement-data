const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const config = require('../config')
const dbConfig = config.dbConfig[config.env]
const storage = require('../storage')
const db = require('../data')
const tableMappings = require('../constants/table-mappings')
const { getFirstLineNumber } = require('./file-utils')

const runEtlProcess = async ({ fileStream, columns, table, mapping, transformer, nonProdTransformer, file }) => {
  const etl = new Etl.Etl()
  const sequelizeModelName = tableMappings[table]
  const initialRowCount = await db[sequelizeModelName]?.count()
  const idFrom = (await db[sequelizeModelName]?.max('etlId') ?? 0) + 1
  const rowCount = await getFirstLineNumber(fileStream)
  const fileInProcess = await db.etlStageLog.create({
    file,
    rowCount
  })

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const etlFlow = etl
          .connection(await new Connections.ProvidedConnection({
            name: 'postgresConnection',
            sequelize: db.sequelize
          }))
          .loader(new Loaders.CSVLoader({ stream: fileStream, columns, startingLine: 3, relax: true }))

        if (nonProdTransformer && !config.isProd) {
          etlFlow.transform(new Transformers.FakerTransformer({
            columns: nonProdTransformer
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
            schema: dbConfig.schema
          }))
          .pump()
          .on('finish', async (data) => {
            global.results.push({
              table,
              database: dbConfig.database,
              data
            })
          })
          .on('result', async (data) => {
            await storage.deleteFile(file)
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
            return resolve(data)
          })
          .on('error', (error) => {
            console.error('ETL Error:', error.message)
            reject(error)
          })
      } catch (e) {
        return reject(e)
      }
    })()
  })
}

module.exports = {
  runEtlProcess
}
