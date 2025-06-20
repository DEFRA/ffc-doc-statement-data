const { publishingConfig } = require('../config')

let processedCount = 0

const shouldProcessDelinked = () => {
  if (!publishingConfig.subsetProcessDelinked) {
    return true
  }
  return processedCount < publishingConfig.processDelinkedSubsetAmount
}

const incrementProcessedCount = (count = 1) => {
  if (!publishingConfig.subsetProcessDelinked) {
    return
  }

  processedCount += count
  console.log(`Delinked subset processing: ${processedCount}/${publishingConfig.processDelinkedSubsetAmount} processed`)

  if (processedCount >= publishingConfig.processDelinkedSubsetAmount) {
    console.log('Delinked subset limit reached, disabling further processing')
  }
}

const getStatus = () => {
  return {
    subsetProcessingEnabled: publishingConfig.subsetProcessDelinked,
    processedCount,
    targetAmount: publishingConfig.processDelinkedSubsetAmount,
    limitReached: processedCount >= publishingConfig.processDelinkedSubsetAmount,
    canProcessMore: shouldProcessDelinked()
  }
}

// For tests to valid must remain
const resetCounter = () => {
  processedCount = 0
}

module.exports = {
  shouldProcessDelinked,
  incrementProcessedCount,
  getStatus,
  resetCounter
}
