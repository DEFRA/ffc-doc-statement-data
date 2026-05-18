const ora = require('ora')
const storage = require('../storage')
const {
  stageApplicationDetails, stageAppsTypes, stageAppsPaymentNotifications, stageBusinessAddressContacts, stageCalculationDetails, stageCSSContractApplications, stageCSSContract, stageCSSOptions, stageDefraLinks, stageFinanceDAX, stageOrganisation, stageTCLCOption,
  stageAppCalcResultsDelinkPayments, stageTdeLinkingTransferTransactions
} = require('./staging')
const { loadETLData } = require('./load-etl-data')
const { etlConfig } = require('../config')
const { createAlerts } = require('../messaging/create-alerts')

let startDate

const stageFunctions = []

if (etlConfig.delinkedEnabled) {
  stageFunctions.push(
    { fn: stageApplicationDetails, label: etlConfig.applicationDetailDelinked.folder },
    { fn: stageAppsTypes, label: etlConfig.appsTypesDelinked.folder },
    { fn: stageAppsPaymentNotifications, label: etlConfig.appsPaymentNotificationDelinked.folder },
    { fn: stageBusinessAddressContacts, label: etlConfig.businessAddressDelinked.folder },
    { fn: stageCalculationDetails, label: etlConfig.calculationsDetailsDelinked.folder },
    { fn: stageCSSContractApplications, label: etlConfig.cssContractApplicationsDelinked.folder },
    { fn: stageCSSContract, label: etlConfig.cssContractDelinked.folder },
    { fn: stageCSSOptions, label: etlConfig.cssOptionsDelinked.folder },
    { fn: stageDefraLinks, label: etlConfig.defraLinksDelinked.folder },
    { fn: stageFinanceDAX, label: etlConfig.financeDAXDelinked.folder },
    { fn: stageOrganisation, label: etlConfig.organisationDelinked.folder },
    { fn: stageTCLCOption, label: etlConfig.tclcOptionDelinked.folder },
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
