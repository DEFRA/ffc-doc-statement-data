const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const fs = require('fs')
const config = require('../config')
const dbConfig = config.dbConfig[config.env]

const runEtlProcess = async ({ tempFilePath, columns, table, mapping, transformer, nonProdTransformer }) => {
  const etl = new Etl.Etl()

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
            await fs.promises.unlink(tempFilePath)
            resolve(data)
          })
          .on('result', (data) => {
            global.results.push({
              table,
              database: dbConfig.database,
              data
            })
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
