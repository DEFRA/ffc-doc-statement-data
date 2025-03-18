const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const config = require('../config')
const dbConfig = config.dbConfig[config.env]
const storage = require('../storage')
const db = require('../data')
const tableMappings = require('../constants/table-mappings')
const { getFirstLineNumber } = require('./file-utils')
const { Writable } = require('stream')

const collectData = () => {
  let data = ''
  const writable = new Writable({
    write (chunk, encoding, callback) {
      data += chunk.toString()
      callback()
    }
  })

  writable.on('finish', () => {
    console.log('Collected Data:', data)
  })

  writable.on('error', (error) => {
    console.error('Error collecting data:', error.message)
  })

  return { writable, getData: () => data }
}

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

  const { writable, getData } = collectData()
  fileStream.pipe(writable)

  await db.sequelize.query(`INSERT INTO "etlStageApplicationDetail" (
    "changeType",
    "changeTime",
    "etlId",
    "etlInsertedDt",
    pkid,
    "dtInsert",
    "dtDelete",
    "subjectId",
    "uteId",
    "applicationId",
    "applicationCode",
    "amendedAppId",
    "appTypeId",
    "proxyId",
    "statusPCode",
    "statusSCode",
    "sourcePCode",
    "sourceSCode",
    "dtStart",
    "dtEnd",
    "validStartFlg",
    "validEndFlg",
    "appIdStart",
    "appIdEnd",
    "dtRecUpdate"
  )
  VALUES (
    'UPDATE',         
    '2023-10-01 12:00:00',     
    1,                          
    CURRENT_TIMESTAMP,
    1001,                       
    NOW(),
    NULL,
    2001,                       
    3001,                       
    4001,                       
    'APP_CODE',                
    5001,                       
    6001,                       
    7001,                       
    'STATUS_P',                
    'STATUS_S',                
    'SOURCE_P',                
    'SOURCE_S',                
    '2023-10-01',              
    '2023-10-31',              
    'Y',                        
    'N',                        
    8001,                       
    9001,                       
    NOW()
);
`)
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const etlFlow = etl
          .connection(await new Connections.ProvidedConnection({
            name: 'postgresConnection',
            sequelize: db.sequelize
          }))
          .loader(new Loaders.CSVLoader({ stream: fileStream, columns, startingLine: 3 }))

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
            console.error('Data causing the error:', getData())
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
