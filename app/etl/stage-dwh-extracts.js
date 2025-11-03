const storage = require('../storage')
const {
  stageApplicationDetails, stageAppsTypes, stageAppsPaymentNotifications, stageBusinessAddressContacts, stageCalculationDetails, stageCSSContractApplications, stageCSSContract, stageCSSOptions, stageDefraLinks, stageFinanceDAX, stageOrganisation, stageTCLCOption,
  stageApplicationDetailsDelinked, stageAppsTypesDelinked, stageAppsPaymentNotificationsDelinked, stageBusinessAddressContactsDelinked, stageCalculationDetailsDelinked, stageCSSContractApplicationsDelinked, stageCSSContractDelinked, stageCSSOptionsDelinked, stageDefraLinksDelinked, stageFinanceDAXDelinked, stageOrganisationDelinked, stageTCLCOptionDelinked,
  stageAppCalcResultsDelinkPayments, stageTdeLinkingTransferTransactions,
  stageDay0BusinessAddressContacts,
  stageDay0Organisation
} = require('./staging')
const { loadETLData } = require('./load-etl-data')
const { etlConfig } = require('../config')
const ora = require('ora')
const { createAlerts } = require('../messaging/create-alerts')

let startDate

const stageFunctions = [
  { fn: stageDay0BusinessAddressContacts, label: etlConfig.day0BusinessAddress.folder },
  { fn: stageDay0Organisation, label: etlConfig.day0Organisation.folder }
]

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

const stageDWHExtracts = async () => {
  startDate = new Date()
  const etlFiles = await storage.getFileList()
  const foldersToStage = new Set(etlFiles.map(file => file.split('/')[0]))

  if (etlFiles.length) {
    const functionsToRun = stageFunctions.filter(({ label }) => foldersToStage.has(label))

    if (functionsToRun.length === 0) {
      console.info('No matching DWH files identified for processing')
      return
    }

    console.log(`Processing ${functionsToRun.length} folders in parallel`)

    const stagingPromises = functionsToRun.map(({ fn, label }) => {
      const spinner = ora(label).start()
      return fn()
        .then(() => {
          spinner.succeed(`${label} - staged`)
          return { success: true, label }
        })
        .catch((e) => {
          spinner.fail(`${label} - ${e.message}`)
          return { success: false, label, error: e.message }
        })
    })

    const results = await Promise.all(stagingPromises)

    const failedOperations = results.filter(result => !result.success)
    if (failedOperations.length > 0) {
      console.error(`ETL process completed with ${failedOperations.length} failures:`)
      for (const op of failedOperations) {
        console.error(`- ${op.label}: ${op.error}`)
      }
      const errors = failedOperations.map(op => ({
        file: op.label,
        message: op.error
      }))
      await createAlerts(errors)
    } else {
      console.log('All ETL extracts loaded successfully')
      await loadETLData(startDate)
    }
    await storage.deleteAllETLExtracts()
  } else {
    console.info('No DWH files identified for processing')
  }
}

module.exports = {
  stageDWHExtracts
}
