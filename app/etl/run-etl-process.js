const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const fs = require('fs').promises
const config = require('../config')
const dbConfig = config.dbConfig[config.env]

const runEtlProcess = async ({ tempFilePath, columns, table, mapping, transformer }) => {
  const etl = new Etl.Etl()

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        let etlFlow = etl
          .connection(await new Connections.PostgresDatabaseConnection({
            username: dbConfig.username,
            password: dbConfig.password,
            host: dbConfig.host,
            database: dbConfig.database,
            port: dbConfig.port,
            name: 'postgresConnection'
          }))
          .loader(new Loaders.CSVLoader({ path: tempFilePath, columns }))

        if (transformer) {
          etlFlow = etlFlow.transform(new Transformers.StringReplaceTransformer(transformer))
        }

        etlFlow
          .destination(new Destinations.PostgresDestination({
            table,
            conection: 'postgresConnection',
            mapping,
            includeErrors: false
          }))
          .pump()
          .on('finish', async (data) => {
            await fs.unlink(tempFilePath)
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
        await fs.unlink(tempFilePath)
        reject(e)
      }
    })()
  })
}

module.exports = {
  runEtlProcess
}
