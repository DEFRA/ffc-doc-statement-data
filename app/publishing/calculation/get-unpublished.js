const getUnpublishedCalculations = require('./get-unpublished-calculations')
const getFundingsByCalculationId = require('./get-fundings-by-calculation-id')
const { publishingConfig } = require('../../config')

const getUnpublished = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource) => {
  const calculations = await getUnpublishedCalculations(transaction, limit)

  const unpublished = []

  for (const calculation of calculations) {
    const fundings = await getFundingsByCalculationId(calculation.calculationId, transaction)
    unpublished.push({
      ...calculation,
      fundings
    })
  }

  return unpublished
}

module.exports = getUnpublished
