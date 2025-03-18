const { executeQuery } = require('./load-interm-utils')

const loadIntermTotal = async (startDate, transaction) => {
  const query = `
    INSERT INTO "etlIntermTotal" (
      "paymentRef", quarter, "totalAmount",
      transdate, invoiceid
    )
    SELECT DISTINCT "paymentRef", 
      D.quarter,
      SUM("transactionAmount") * -1 as "totalAmount",
      transdate,
      invoiceid
    FROM "etlIntermFinanceDax" D 
    WHERE D."paymentRef" LIKE 'PY%' 
      AND D."etlInsertedDt" > :startDate
    GROUP BY transdate, quarter, "paymentRef", invoiceid
    ORDER BY "paymentRef";
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermTotal
}
