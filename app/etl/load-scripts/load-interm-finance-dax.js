const { etlConfig } = require('../../config')
const intermFinanceDaxQuery = require('../../constants/interm-finance-dax-query')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const loadIntermFinanceDAX = async (startDate, transaction) => {
  const etlStageLog = await getEtlStageLogs(startDate, etlConfig.financeDAX.folder)

  if (!etlStageLog[0]) {
    return
  }

  const query = intermFinanceDaxQuery
  const batchSize = etlConfig.etlBatchSize
  const idFrom = etlStageLog[0].idFrom
  const idTo = etlStageLog[0].idTo
  for (let i = idFrom; i <= idTo; i += batchSize) {
    console.log(`Processing financeDAX records ${i} to ${Math.min(i + batchSize - 1, idTo)}`)
    await executeQuery(query, {
      idFrom,
      idTo: Math.min(i + batchSize - 1, idTo)
    }, transaction)
  }
}

module.exports = {
  loadIntermFinanceDAX
}
