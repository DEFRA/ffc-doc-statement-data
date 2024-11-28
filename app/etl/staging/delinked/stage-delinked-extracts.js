const { writeToString } = require('@fast-csv/format')
const moment = require('moment')
const storage = require('../../../storage')
const { stageApplicationDetails, stageAppsTypes, stageAppsPaymentNotifications, stageBusinessAddressContacts, stageCalculationDetails, stageDefraLinks, stageFinanceDAX, stageOrganisation, stageCalcResultsDelinkPayments, stageTdeLinking } = require('.')
const { loadETLData } = require('../../load-etl-data')
const { delinkedStorageConfig } = require('../../../config')

let completed = 0

global.results = []

let total
let startDate

const checkComplete = async () => {
  if (completed < total) {
    setTimeout(checkComplete, 5000)
  } else {
    console.log('All Delinked ETL extracts loaded')
    const body = await writeToString(global.results)
    const outboundBlobClient = await storage.getBlob(`${delinkedStorageConfig.etlLogsFolder}/ETL_Import_Results_${moment().format('YYYYMMDD HH:mm:ss')}`)
    await outboundBlobClient.upload(body, body.length)
    await loadETLData(startDate)
  }
}

const stageFunctions = [
  { fn: stageApplicationDetails, label: delinkedStorageConfig.applicationDetail.folder },
  { fn: stageAppsTypes, label: delinkedStorageConfig.appsTypes.folder },
  { fn: stageAppsPaymentNotifications, label: delinkedStorageConfig.appsPaymentNotification.folder },
  { fn: stageBusinessAddressContacts, label: delinkedStorageConfig.businessAddress.folder },
  { fn: stageCalculationDetails, label: delinkedStorageConfig.calculationsDetails.folder },
  { fn: stageCalcResultsDelinkPayments, label: delinkedStorageConfig.calcResultsDelinkPayments.folder },
  { fn: stageDefraLinks, label: delinkedStorageConfig.defraLinks.folder },
  { fn: stageFinanceDAX, label: delinkedStorageConfig.financeDAX.folder },
  { fn: stageOrganisation, label: delinkedStorageConfig.organisation.folder },
  { fn: stageTdeLinking, label: delinkedStorageConfig.tdeLinking.folder }
]

const stageDelinkedExtracts = async () => {
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
    console.info('No Delinked DWH files identified for processing')
  }
}

module.exports = {
  stageDelinkedExtracts
}
