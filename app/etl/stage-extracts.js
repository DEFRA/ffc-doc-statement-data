const { writeToString } = require('@fast-csv/format')
const moment = require('moment')
const storage = require('../storage')
const {
  stageApplicationDetails, stageAppsTypes, stageAppsPaymentNotifications, stageBusinessAddressContacts, stageCalculationDetails, stageCSSContractApplications, stageCSSContract, stageCSSOptions, stageDefraLinks, stageFinanceDAX, stageOrganisation, stageTCLCOption,
  stageApplicationDetailsDelinked, stageAppsTypesDelinked, stageAppsPaymentNotificationsDelinked, stageBusinessAddressContactsDelinked, stageCalculationDetailsDelinked, stageCSSContractApplicationsDelinked, stageCSSContractDelinked, stageCSSOptionsDelinked, stageDefraLinksDelinked, stageFinanceDAXDelinked, stageOrganisationDelinked, stageTCLCOptionDelinked,
  stageAppCalcResultsDelinkPayments, stageTdeLinkingTransferTransactions
} = require('./staging')
const { loadETLData } = require('./load-etl-data')
const { etlConfig } = require('../config')
const ora = require('ora')

let completed = 0

global.results = []

let total
let startDate

const checkComplete = async () => {
  if (completed < total) {
    setTimeout(checkComplete, etlConfig.checkCompleteTimeoutMs)
  } else {
    console.log('All ETL extracts loaded')
    const body = await writeToString(global.results)
    const outboundBlobClient = await storage.getBlob(`${etlConfig.etlLogsFolder}/ETL_Import_Results_${moment().format('YYYYMMDD HH:mm:ss')}`)
    await outboundBlobClient.upload(body, body.length)
    await loadETLData(startDate)
  }
}

const stageFunctions = []

if (etlConfig.sfi23Enabled) {
  stageFunctions.push(
    { fn: stageApplicationDetails, label: etlConfig.applicationDetail.folder },
    { fn: stageAppsTypes, label: etlConfig.appsTypes.folder },
    { fn: stageAppsPaymentNotifications, label: etlConfig.appsPaymentNotification.folder },
    { fn: stageBusinessAddressContacts, label: etlConfig.businessAddress.folder },
    { fn: stageCalculationDetails, label: etlConfig.calculationsDetails.folder },
    { fn: stageCSSContractApplications, label: etlConfig.cssContractApplications.folder },
    { fn: stageCSSContract, label: etlConfig.cssContract.folder },
    { fn: stageCSSOptions, label: etlConfig.cssOptions.folder },
    { fn: stageDefraLinks, label: etlConfig.defraLinks.folder },
    { fn: stageFinanceDAX, label: etlConfig.financeDAX.folder },
    { fn: stageOrganisation, label: etlConfig.organisation.folder },
    { fn: stageTCLCOption, label: etlConfig.tclcOption.folder }
  )
}

if (etlConfig.delinkedEnabled) {
  stageFunctions.push(
    { fn: stageApplicationDetailsDelinked, label: etlConfig.applicationDetailDelinked.folder },
    { fn: stageAppsTypesDelinked, label: etlConfig.appsTypesDelinked.folder },
    { fn: stageAppsPaymentNotificationsDelinked, label: etlConfig.appsPaymentNotificationDelinked.folder },
    { fn: stageBusinessAddressContactsDelinked, label: etlConfig.businessAddressDelinked.folder },
    { fn: stageCalculationDetailsDelinked, label: etlConfig.calculationsDetailsDelinked.folder },
    { fn: stageCSSContractApplicationsDelinked, label: etlConfig.cssContractApplicationsDelinked.folder },
    { fn: stageCSSContractDelinked, label: etlConfig.cssContractDelinked.folder },
    { fn: stageCSSOptionsDelinked, label: etlConfig.cssOptionsDelinked.folder },
    { fn: stageDefraLinksDelinked, label: etlConfig.defraLinksDelinked.folder },
    { fn: stageFinanceDAXDelinked, label: etlConfig.financeDAXDelinked.folder },
    { fn: stageOrganisationDelinked, label: etlConfig.organisationDelinked.folder },
    { fn: stageTCLCOptionDelinked, label: etlConfig.tclcOptionDelinked.folder },
    { fn: stageAppCalcResultsDelinkPayments, label: etlConfig.appCalculationResultsDelinkPayments.folder },
    { fn: stageTdeLinkingTransferTransactions, label: etlConfig.tdeLinkingTransferTransactions.folder }
  )
}

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
