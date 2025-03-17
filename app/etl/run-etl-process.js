const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const config = require('../config')
const dbConfig = config.dbConfig[config.env]
const storage = require('../storage')
const db = require('../data')
const tableMappings = require('../constants/table-mappings')
const { removeFirstLine, getFirstLineNumber } = require('./file-utils')

const runEtlProcess = async ({ fileStream, columns, table, mapping, transformer, nonProdTransformer, file }) => {
  const etl = new Etl.Etl()

  const sequelizeModelName = tableMappings[table]
  const initialRowCount = await db[sequelizeModelName]?.count()
  const idFrom = (await db[sequelizeModelName]?.max('etl_id') ?? 0) + 1
  const rowCount = await getFirstLineNumber(fileStream)
  fileStream = await removeFirstLine(fileStream)
  const fileInProcess = await db.etlStageLog.create({
    file,
    row_count: rowCount
  })

  await db.etlStageApplicationDetail.create({
    change_type: 'INSERT',
    change_time: new Date(),
    etl_id: idFrom,
    etl_inserted_dt: new Date(),
    pkid: 1002,
    dt_insert: new Date(),
    dt_delete: null,
    subject_id: 2002,
    ute_id: 3002,
    application_id: 4002,
    application_code: 'NEW_APP_CODE',
    amended_app_id: 5002,
    app_type_id: 6002,
    proxy_id: 7002,
    status_p_code: 'NEW_STATUS_P',
    status_s_code: 'NEW_STATUS_S',
    source_p_code: 'NEW_SOURCE_P',
    source_s_code: 'NEW_SOURCE_S',
    dt_start: '2023-10-02',
    dt_end: '2023-11-01',
    valid_start_flg: 'Y',
    valid_end_flg: 'N',
    app_id_start: 8002,
    app_id_end: 9002,
    dt_rec_update: new Date()
  })

  await db.sequelize.query(`INSERT INTO etl_stage_application_detail (
    change_type,
    change_time,
    etl_id,
    etl_inserted_dt,
    pkid,
    dt_insert,
    dt_delete,
    subject_id,
    ute_id,
    application_id,
    application_code,
    amended_app_id,
    app_type_id,
    proxy_id,
    status_p_code,
    status_s_code,
    source_p_code,
    source_s_code,
    dt_start,
    dt_end,
    valid_start_flg,
    valid_end_flg,
    app_id_start,
    app_id_end,
    dt_rec_update
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
          .loader(new Loaders.CSVLoader({ stream: fileStream, columns }))

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
            return resolve(data)
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
