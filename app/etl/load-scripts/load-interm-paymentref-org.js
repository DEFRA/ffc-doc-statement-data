const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadIntermPaymentrefOrg = async (startDate, transaction) => {
  const query = `
    INSERT INTO ${dbConfig.schema}."etlIntermPaymentrefOrg" ("paymentRef", sbi, frn)
    SELECT PA."paymentRef", O.sbi, O.frn::bigint 
      FROM ${dbConfig.schema}."etlIntermPaymentrefApplication" PA 
    INNER JOIN ${dbConfig.schema}."etlIntermCalcOrg" O ON O."applicationId" = PA."applicationId"
    WHERE PA."etlInsertedDt" > :startDate
      OR O."etlInsertedDt" > :startDate
    GROUP BY PA."paymentRef", O.sbi, O.frn;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermPaymentrefOrg
}
