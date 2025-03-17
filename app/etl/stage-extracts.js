const { writeToString } = require('@fast-csv/format')
const moment = require('moment')
const storage = require('../storage')
const { stageApplicationDetails, stageAppsTypes, stageAppsPaymentNotifications, stageBusinessAddressContacts, stageCalculationDetails, stageCSSContractApplications, stageCSSContract, stageCSSOptions, stageDefraLinks, stageFinanceDAX, stageOrganisation, stageTCLCOption } = require('./staging')
const { loadETLData } = require('./load-etl-data')
const { storageConfig } = require('../config')
const ora = require('ora')

let completed = 0

global.results = []

let total
let startDate

const checkComplete = async () => {
  if (completed < total) {
    setTimeout(checkComplete, storageConfig.checkCompleteTimeoutMs)
  } else {
    console.log('All ETL extracts loaded')
    const body = await writeToString(global.results)
    const outboundBlobClient = await storage.getBlob(`${storageConfig.etlLogsFolder}/ETL_Import_Results_${moment().format('YYYYMMDD HH:mm:ss')}`)
    await outboundBlobClient.upload(body, body.length)
    await loadETLData(startDate)
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
  startDate = new Date()
  const etlFiles = await storage.getFileList()
  const foldersToStage = etlFiles.map(file => file.split('/')[0])
  total = foldersToStage.length
  if (etlFiles.length) {
    for (const { fn, label } of stageFunctions) {
      if (foldersToStage.includes(label)) {
        const spinner = ora(label).start()
        await fn()
          .then(() => spinner.succeed(`${label} - staged`))
          .catch((e) => spinner.fail(`${label} - ${e.message}`))
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
