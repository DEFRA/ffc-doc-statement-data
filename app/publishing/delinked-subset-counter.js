const { publishingConfig } = require('../config')

let processedCount = 0
let subsetEstablished = false

const processedDelinkedOrganisations = new Set() // Will store SBI/FRN values
const processedDelinkedCalculations = new Set() // Will store calculationId values
const processedDelinkedD365Records = new Set() // Will store d365Id values

const subsetFilter = {
  organisationKeys: new Set(), // SBI/FRN values that should be processed
  calculationIds: new Set() // calculationId values that should be processed
}

const shouldProcessDelinked = () => {
  if (!publishingConfig.subsetProcessDelinked) {
    return true
  }

  const shouldProcess = processedCount < publishingConfig.processDelinkedSubsetAmount
  return shouldProcess
}

const establishSubsetFilter = async (getUnpublishedDelinkedCalc) => {
  if (!publishingConfig.subsetProcessDelinked || subsetEstablished) {
    return
  }

  console.log('Establishing subset filter from delinkedCalculation records...')

  const delinkedCalcRecords = await getUnpublishedDelinkedCalc(null, publishingConfig.processDelinkedSubsetAmount)
  console.log(`Retrieved ${delinkedCalcRecords.length} delinkedCalculation records for subset filter`)

  for (const record of delinkedCalcRecords.slice(0, publishingConfig.processDelinkedSubsetAmount)) {
    if (record.calculationReference) {
      subsetFilter.calculationIds.add(record.calculationReference)
    }

    const orgKey = record.sbi || record.frn
    if (orgKey) {
      subsetFilter.organisationKeys.add(orgKey)
    }
  }

  subsetEstablished = true
  console.log(`Subset filter established: ${subsetFilter.organisationKeys.size} organisations, ${subsetFilter.calculationIds.size} calculations`)
}

const shouldProcessDelinkedRecord = (record, type) => {
  if (!publishingConfig.subsetProcessDelinked) {
    return true // No subset processing, allow all
  }

  switch (type) {
    case 'delinkedCalculation': {
      if (!shouldProcessDelinked()) {
        return false
      }

      if (!subsetEstablished) {
        return true // Allow delinkedCalculation to establish subset
      }

      const calculationRef = record.calculationReference
      return calculationRef && subsetFilter.calculationIds.has(calculationRef)
    }

    case 'organisation': {
      const orgKey = record.sbi || record.frn
      if (!orgKey) {
        return false
      }

      if (!subsetEstablished) {
        return false
      }

      return subsetFilter.organisationKeys.has(orgKey) &&
             !processedDelinkedOrganisations.has(orgKey)
    }

    case 'd365': {
      if (!subsetEstablished) {
        return false
      }

      const calculationRef = record.calculationReference
      if (!calculationRef) {
        return false
      }

      return subsetFilter.calculationIds.has(calculationRef)
    }

    default:
      return true // Non-delinked types are always allowed
  }
}

const trackProcessedDelinkedRecord = (record, type) => {
  if (!publishingConfig.subsetProcessDelinked) {
    return
  }

  switch (type) {
    case 'delinkedCalculation': {
      if (record.calculationReference) {
        processedDelinkedCalculations.add(record.calculationReference)
      }
      const orgKey = record.sbi || record.frn
      if (orgKey) {
        processedDelinkedOrganisations.add(orgKey)
      }
      break
    }

    case 'organisation': {
      const orgKeyOrg = record.sbi || record.frn
      if (orgKeyOrg) {
        processedDelinkedOrganisations.add(orgKeyOrg)
      }
      break
    }

    case 'd365':
      if (record.d365Id) {
        processedDelinkedD365Records.add(record.d365Id)
      }
      break
  }
}

const incrementProcessedCount = (count = 1) => {
  if (!publishingConfig.subsetProcessDelinked) {
    return
  }

  processedCount += count

  if (processedCount >= publishingConfig.processDelinkedSubsetAmount) {
    console.log(`Delinked subset processing: ${processedCount}/${publishingConfig.processDelinkedSubsetAmount} processed - limit reached`)
  } else if (processedCount % 5 === 0) {
    console.log(`Delinked subset processing: ${processedCount}/${publishingConfig.processDelinkedSubsetAmount} processed`)
  }
}

const getStatus = () => {
  return {
    subsetProcessingEnabled: publishingConfig.subsetProcessDelinked,
    processedCount,
    targetAmount: publishingConfig.processDelinkedSubsetAmount,
    limitReached: processedCount >= publishingConfig.processDelinkedSubsetAmount,
    canProcessMore: shouldProcessDelinked(),
    subsetEstablished,
    filterOrganisations: subsetFilter.organisationKeys.size,
    filterCalculations: subsetFilter.calculationIds.size,
    trackedOrganisations: processedDelinkedOrganisations.size,
    trackedCalculations: processedDelinkedCalculations.size,
    trackedD365Records: processedDelinkedD365Records.size
  }
}

const getTrackingSets = () => {
  return {
    organisations: Array.from(processedDelinkedOrganisations),
    calculations: Array.from(processedDelinkedCalculations),
    d365Records: Array.from(processedDelinkedD365Records),
    filterOrganisations: Array.from(subsetFilter.organisationKeys),
    filterCalculations: Array.from(subsetFilter.calculationIds)
  }
}

const resetCounter = () => {
  processedCount = 0
  subsetEstablished = false
  processedDelinkedOrganisations.clear()
  processedDelinkedCalculations.clear()
  processedDelinkedD365Records.clear()
  subsetFilter.organisationKeys.clear()
  subsetFilter.calculationIds.clear()
}

module.exports = {
  shouldProcessDelinked,
  shouldProcessDelinkedRecord,
  trackProcessedDelinkedRecord,
  establishSubsetFilter,
  incrementProcessedCount,
  getStatus,
  getTrackingSets,
  resetCounter
}
