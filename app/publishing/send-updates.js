const { publishingConfig } = require('../config')
const { ORGANISATION, DELINKED_CALCULATION, D365, CALCULATION, DAX, TOTAL } = require('../constants/types')
const { DELINKED } = require('../constants/schemes')
const getSubsetCheck = require('./subset/get-subset-check')
const defaultPublishingPerType = require('./default-publishing-per-type')
const sendDelinkedSubset = require('./subset/send-delinked-subset')

const setupProcessing = async (scheme) => {
  if (publishingConfig[scheme].subsetProcess) {
    const count = await getSubsetCheck(scheme)

    if (!count) {
      console.log(`Error occurred determining ${scheme} records sent to date`)
      return false
    }
    if (count.subsetSent) {
      console.log(`Skipping ${scheme} processing - scheme subset limit reached`)
      return false
    }
    console.log(`Processing ${scheme} with subset control active`)
  } else {
    console.log(`Processing ${scheme} updates normally`)
  }
  return true
}

const sendUpdates = async (scheme) => {
  if (!publishingConfig.publishingEnabled) {
    console.log('Publishing is disabled via publishingEnabled=false flag')
    return
  }

  const shouldProceed = await setupProcessing(scheme)
  if (!shouldProceed) {
    return
  }

  if (scheme === DELINKED && publishingConfig.delinked.subsetProcess) {
    await sendDelinkedSubset()
  } else if (!publishingConfig.delinked.subsetProcess && !publishingConfig.sfi23.subsetProcess) {
    const types = [ORGANISATION]
    if (scheme === DELINKED) {
      types.push(DELINKED_CALCULATION)
      types.push(D365)
    } else {
      types.push(TOTAL)
      types.push(CALCULATION)
      types.push(DAX)
    }
    for (const type of types) {
      await defaultPublishingPerType(type)
    }
  } else {
    console.log('A subset process is in operation, normal processing not completed')
  }
}

module.exports = sendUpdates
