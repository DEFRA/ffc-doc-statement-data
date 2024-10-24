const fs = require('fs')
const storage = require('../storage')
const { stageApplicationDetails, stageAppsTypes, stageAppsPaymentNotifications, stageBusinessAddressContacts, stageCalculationDetails, stageCSSContractApplications, stageCSSContract, stageCSSOptions, stageDefraLinks, stageFinanceDAX, stageOrganisation, stageTCLCOption } = require('./staging')
const { loadETLData } = require('./load-etl-data')
const { storageConfig } = require('../config')

let completed = 0

global.results = []

let total

const checkComplete = async () => {
  if (completed < total) {
    setTimeout(checkComplete, 5000)
  } else {
    console.log('All ETL extracts loaded')
    fs.writeFileSync('result.log', JSON.stringify(global.results, null, 2))
    // await loadETLData()
  }
}

const stageFunctions = [
  { fn: stageApplicationDetails, label: storageConfig.applicationDetail.folder },
  { fn: stageAppsTypes, label: storageConfig.appsTypes.folder },
  { fn: stageAppsPaymentNotifications, label: storageConfig.appsPaymentNotification.folder },
  { fn: stageBusinessAddressContacts, label: storageConfig.businessAddress.folder },
  { fn: stageCalculationDetails, label: storageConfig.calculationsDetails.folder },
  { fn: stageCSSContractApplications, label: storageConfig.cssContractApplications.folder },
  { fn: stageCSSContract, label: storageConfig.cssContract.folder },
  { fn: stageCSSOptions, label: storageConfig.cssOptions.folder },
  { fn: stageDefraLinks, label: storageConfig.defraLinks.folder },
  { fn: stageFinanceDAX, label: storageConfig.financeDAX.folder },
  { fn: stageOrganisation, label: storageConfig.organisation.folder },
  { fn: stageTCLCOption, label: storageConfig.tclcOption.folder }
]

const stageExtracts = async () => {
  const etlFiles = await storage.getFileList()
  const foldersToStage = etlFiles.map(file => file.split('/')[0])
  total = foldersToStage.length

  if (etlFiles.length) {
    const { Spinner } = await import('@topcli/spinner')
    for (const { fn, label } of stageFunctions) {
      if (foldersToStage.includes(label)) {
        const spinner = new Spinner().start(label)
        await fn()
          .then(() => spinner.succeed(`${label} - staged`))
          .catch((e) => spinner.failed(`${label} - ${e.message}`))
          .finally(() => {
            completed += 1
          })
      }
    }
    await checkComplete()
  } else {
    console.info('No DWH files identified for processing')
  }
}

module.exports = {
  stageExtracts
}
