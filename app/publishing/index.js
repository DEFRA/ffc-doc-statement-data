const config = require('../config')
const sendUpdates = require('./send-updates')
const { ORGANISATION, DELINKED, CALCULATION, TOTAL, DAX, D365 } = require('./types')
const db = require('../data')
const publishingConfig = config.publishingConfig
const dbConfig = config.dbConfig[config.env]

const start = async () => {
  try {
    console.log('Ready to publish data')
    await sendUpdates(ORGANISATION)
    await sendUpdates(DELINKED)
    await sendUpdates(CALCULATION)
    await sendUpdates(TOTAL)
    await sendUpdates(DAX)
    await sendUpdates(D365)
    console.log('All outstanding valid datasets published')
    await db.sequelize.query(`INSERT INTO ${dbConfig.schema}.organisations (
      sbi,
      "addressLine1",
      "addressLine2",
      "addressLine3",
      city,
      county,
      postcode,
      "emailAddress",
      frn,
      name,
      updated,
      published
    ) VALUES (
      123456,
      '123 Farm Lane',
      'Rural Area',
      NULL,
      'Farmville',
      'Countryside',
      'AB12 3CD',
      'farmer@example.com',
      987654,
      'Green Acres Farm',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    );
    `)
    await db.sequelize.query(`INSERT INTO ${dbConfig.schema}."etlStageApplicationDetail" (
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
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, publishingConfig.pollingInterval)
  }
}

module.exports = { start }
