const { writeToString } = require('@fast-csv/format')
const moment = require('moment')
const storage = require('../../../storage')
const { stageApplicationDetails, stageAppsTypes, stageAppsPaymentNotifications, stageBusinessAddressContacts, stageCalculationDetails, stageCSSContractApplications, stageCSSContract, stageCSSOptions, stageDefraLinks, stageFinanceDAX, stageOrganisation, stageTCLCOption } = require('.')
const { loadETLData } = require('../../load-etl-data')
const { sfi23StorageConfig } = require('../../../config')

let completed = 0

global.results = []

let total
let startDate

const checkComplete = async () => {
  if (completed < total) {
    setTimeout(checkComplete, 5000)
  } else {
    console.log('All SFI23 ETL extracts loaded')
    const body = await writeToString(global.results)
    const outboundBlobClient = await storage.getBlob(`${sfi23StorageConfig.etlLogsFolder}/ETL_Import_Results_${moment().format('YYYYMMDD HH:mm:ss')}`)
    await outboundBlobClient.upload(body, body.length)
    await loadETLData(startDate)
  }
}

const stageFunctions = [
  { fn: stageApplicationDetails, label: sfi23StorageConfig.applicationDetail.folder },
  { fn: stageAppsTypes, label: sfi23StorageConfig.appsTypes.folder },
  { fn: stageAppsPaymentNotifications, label: sfi23StorageConfig.appsPaymentNotification.folder },
  { fn: stageBusinessAddressContacts, label: sfi23StorageConfig.businessAddress.folder },
  { fn: stageCalculationDetails, label: sfi23StorageConfig.calculationsDetails.folder },
  { fn: stageCSSContractApplications, label: sfi23StorageConfig.cssContractApplications.folder },
  { fn: stageCSSContract, label: sfi23StorageConfig.cssContract.folder },
  { fn: stageCSSOptions, label: sfi23StorageConfig.cssOptions.folder },
  { fn: stageDefraLinks, label: sfi23StorageConfig.defraLinks.folder },
  { fn: stageFinanceDAX, label: sfi23StorageConfig.financeDAX.folder },
  { fn: stageOrganisation, label: sfi23StorageConfig.organisation.folder },
  { fn: stageTCLCOption, label: sfi23StorageConfig.tclcOption.folder }
]

const stageSfi23Extracts = async () => {
  startDate = new Date()
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
    console.info('No SFI23 DWH files identified for processing')
  }
}

module.exports = {
  stageSfi23Extracts
}
