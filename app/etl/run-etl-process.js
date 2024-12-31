const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const fs = require('fs')
const readline = require('readline')
const config = require('../config')
const dbConfig = config.dbConfig[config.env]
const storage = require('../storage')
const db = require('../data')
const tableMappings = require('../constants/table-mappings')

const getFirstLineNumber = async (filePath) => {
  const readable = fs.createReadStream(filePath)
  const reader = readline.createInterface({ input: readable })

  return new Promise((resolve, reject) => {
    reader.on('line', (line) => {
      reader.close()
      readable.destroy()
      resolve(parseInt(line.trim(), 10))
    })

    reader.on('error', (err) => {
      readable.destroy()
      reject(err)
    })
  })
}

const removeFirstLine = async (filePath) => {
  const data = await fs.promises.readFile(filePath, 'utf8')
  const lines = data.split('\n')
  const output = lines.slice(1).join('\n')
  await fs.promises.writeFile(filePath, output)
}

const runEtlProcess = async ({ tempFilePath, columns, table, mapping, transformer, nonProdTransformer, file }) => {
  const etl = new Etl.Etl()

  const sequelizeModelName = tableMappings[table]
  const initialRowCount = await db[sequelizeModelName]?.count()
  const idFrom = (await db[sequelizeModelName]?.max('etl_id') ?? 0) + 1
  const rowCount = await getFirstLineNumber(tempFilePath)
  await removeFirstLine(tempFilePath)
  const fileInProcess = await db.etlStageLog.create({
    file,
    row_count: rowCount
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
            global.results.push({
              table,
              database: dbConfig.database,
              data
            })
          })
          .on('result', async (data) => {
            await fs.promises.unlink(tempFilePath)
            await storage.deleteFile(file)
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
      } catch (e) {
        await fs.promises.unlink(tempFilePath)
        reject(e)
      }
    })()
  })
}

module.exports = {
  runEtlProcess,
  removeFirstLine,
  getFirstLineNumber
}
