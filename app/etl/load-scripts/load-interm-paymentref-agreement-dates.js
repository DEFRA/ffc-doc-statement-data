const config = require('../../config')
const TABLES = require('../../constants/etl-tables')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadIntermPaymentrefAgreementDates = async (startDate, transaction) => {
  const query = `
    INSERT INTO ${dbConfig.schema}."${TABLES.etlIntermPaymentrefAgreementDates}" (
      "paymentRef", "agreementStart", "agreementEnd"
    )
    SELECT
      DA."paymentRef",
      (SELECT "agreementStart" FROM ${dbConfig.schema}."${TABLES.etlIntermApplicationContract}" IAC WHERE IAC."contractId" = CA."contractId" LIMIT 1),
      (SELECT "agreementEnd" FROM ${dbConfig.schema}."${TABLES.etlIntermApplicationContract}" IAC WHERE IAC."contractId" = CA."contractId" LIMIT 1)
    FROM ${dbConfig.schema}."${TABLES.etlIntermFinanceDax}" DA
    INNER JOIN ${dbConfig.schema}."${TABLES.etlStageCssContractApplications}" CA ON CA."applicationId" = DA."claimId"
    INNER JOIN ${dbConfig.schema}."${TABLES.etlIntermApplicationContract}" IAC ON IAC."contractId" = CA."contractId"
    WHERE IAC."agreementStart" IS NOT NULL
      AND IAC."agreementEnd" IS NOT NULL
      AND (
        DA."etlInsertedDt" > :startDate
        OR CA."etlInsertedDt" > :startDate
        OR IAC."etlInsertedDt" > :startDate
      )
    GROUP BY DA."paymentRef", CA."contractId"
    ON CONFLICT ("paymentRef", "agreementStart", "agreementEnd") DO NOTHING;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermPaymentrefAgreementDates
}
