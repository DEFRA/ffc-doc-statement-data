const db = require('../../data')

const loadDAX = async (startDate, transaction) => {
  await db.sequelize.query(`
    INSERT INTO dax (
      "paymentReference", "calculationId", "paymentPeriod",
      "paymentAmount", "transactionDate"
    )
    SELECT DISTINCT
      T.paymentRef AS paymentReference,
      T.calculationId AS calculationId,
      T.quarter AS paymentPeriod, 
      T.totalAmount AS paymentAmount,
      T.transdate AS transactionDate 
    FROM etlIntermTotal T
    WHERE T.etlInsertedDt > :startDate;
  `, {
    replacements: {
      startDate
    },
    raw: true,
    transaction
  })
}

module.exports = {
  loadDAX
}
