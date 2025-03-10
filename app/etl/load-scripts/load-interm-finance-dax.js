const { storageConfig } = require('../../config')
const intermFinanceDaxQuery = require('../../constants/interm-finance-dax-query')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const loadIntermFinanceDAX = async (startDate) => {
  const etlStageLog = await getEtlStageLogs(startDate, storageConfig.financeDAX.folder)

  if (!etlStageLog[0]) {
    return
  }

  const query = intermFinanceDaxQuery
  const batchSize = storageConfig.etlBatchSize
  const idFrom = etlStageLog[0].id_from
  const idTo = etlStageLog[0].id_to
  for (let i = idFrom; i <= idTo; i += batchSize) {
    console.log(`Processing financeDAX records ${i} to ${Math.min(i + batchSize - 1, idTo)}`)
    await executeQuery(query, {
      idFrom,
      idTo: Math.min(i + batchSize - 1, idTo)
    })
  }
}

module.exports = {
  loadIntermFinanceDAX
}
