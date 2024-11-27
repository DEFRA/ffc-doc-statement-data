const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const fs = require('fs')
const config = require('../../../config')
const dbConfig = config.dbConfig[config.env]
const storage = require('../../../storage')
const db = require('../../../data')
const { getRowCount } = require('../../get-row-count')
const tableMappings = require('../../../constants/sfi23-mappings')

const runEtlProcess = async ({ tempFilePath, columns, table, mapping, transformer, nonProdTransformer, file }) => {
  const etl = new Etl.Etl()

  const sequelizeModelName = tableMappings[table]
  const initialRowCount = await db[sequelizeModelName]?.count()
  const idFrom = (await db[sequelizeModelName]?.max('etl_id') ?? 0) + 1
  const fileInProcess = await db.etlStageLog.create({
    file,
    row_count: await getRowCount(tempFilePath)
  })

  return new Promise((resolve, reject) => {
    (async () => {
      if (!fs.existsSync(tempFilePath)) {
        return resolve(true)
      }
      try {
        const etlFlow = etl
          .connection(await new Connections.PostgresDatabaseConnection({
            username: dbConfig.username,
            password: dbConfig.password,
            host: dbConfig.host,
            database: dbConfig.database,
            port: dbConfig.port,
            name: 'postgresConnection'
          }))
          .loader(new Loaders.CSVLoader({ path: tempFilePath, columns }))

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
            includeErrors: false
          }))
          .pump()
          .on('finish', async (data) => {
            const newRowCount = await db[sequelizeModelName]?.count()
            const idTo = await db[sequelizeModelName]?.max('etl_id') ?? 0
            await db.etlStageLog.update(
              {
                rows_loaded_count: newRowCount - initialRowCount,
                id_to: idTo,
                id_from: idFrom < idTo ? idFrom : idTo,
                ended_at: new Date()
              },
              { where: { etl_id: fileInProcess.etl_id } }
            )
            resolve(data)
          })
          .on('result', async (data) => {
            global.results.push({
              table,
              database: dbConfig.database,
              data
            })
            await fs.promises.unlink(tempFilePath)
            await storage.deleteFile(file)
          })
      } catch (e) {
        await fs.promises.unlink(tempFilePath)
        reject(e)
      }
    })()
  })
}

module.exports = {
  runEtlProcess
}
