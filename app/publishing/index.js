const { publishingConfig } = require('../config')
const sendUpdates = require('./send-updates')
const { ORGANISATION, DELINKED, CALCULATION, TOTAL, DAX, D365 } = require('./types')
const db = require('../data')

const start = async () => {
  try {
    console.log('Ready to publish data')
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
    await sendUpdates(ORGANISATION)
    await sendUpdates(DELINKED)
    await sendUpdates(CALCULATION)
    await sendUpdates(TOTAL)
    await sendUpdates(DAX)
    await sendUpdates(D365)
    console.log('All outstanding valid datasets published')
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, publishingConfig.pollingInterval)
  }
}

module.exports = { start }
