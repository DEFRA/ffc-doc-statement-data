const { executeQuery } = require('./load-interm-utils')

const loadIntermTotalClaim = async (startDate, transaction) => {
  const query = `
    INSERT INTO "etlIntermTotalClaim" ("claimId", "paymentRef")
    SELECT
      (SELECT "claimId" FROM "etlIntermFinanceDax" WHERE "paymentRef" = T."paymentRef" LIMIT 1) as "applicationId",
      T."paymentRef"
    FROM "etlIntermTotal" T
    WHERE T."etlInsertedDt" > :startDate
    ON CONFLICT ("claimId", "paymentRef") DO NOTHING;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermTotalClaim
}
