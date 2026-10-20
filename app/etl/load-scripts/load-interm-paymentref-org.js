const config = require('../../config')
const TABLES = require('../../constants/etl-tables')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadIntermPaymentrefOrg = async (startDate, transaction) => {
  const query = `
    INSERT INTO ${dbConfig.schema}."${TABLES.etlIntermPaymentrefOrg}" ("paymentRef", sbi, frn)
    SELECT PA."paymentRef", O.sbi, O.frn::bigint
      FROM ${dbConfig.schema}."${TABLES.etlIntermPaymentrefApplication}" PA
    INNER JOIN ${dbConfig.schema}."${TABLES.etlIntermCalcOrg}" O ON O."applicationId" = PA."applicationId"
    WHERE PA."etlInsertedDt" > :startDate
      OR O."etlInsertedDt" > :startDate
    GROUP BY PA."paymentRef", O.sbi, O.frn
    ON CONFLICT ("paymentRef", sbi, frn)
    DO UPDATE SET "etlInsertedDt" = EXCLUDED."etlInsertedDt";
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermPaymentrefOrg
}
