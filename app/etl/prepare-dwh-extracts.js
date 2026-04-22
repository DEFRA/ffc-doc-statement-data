const { etlConfig } = require('../config')
const { createAlerts } = require('../messaging/create-alerts')
const { getDWHExtracts, moveFile, quarantineAllFiles, deleteFile } = require('../storage')
const { unzipDWHExtracts } = require('./unzip-dwh-extracts')

const FILE_PATH_LOOKUP = {
  [etlConfig.applicationDetailDelinked.fileMask]: etlConfig.applicationDetailDelinked.folder,
  [etlConfig.appsPaymentNotificationDelinked.fileMask]: etlConfig.appsPaymentNotificationDelinked.folder,
  [etlConfig.appsTypesDelinked.fileMask]: etlConfig.appsTypesDelinked.folder,
  [etlConfig.businessAddressDelinked.fileMask]: etlConfig.businessAddressDelinked.folder,
  [etlConfig.calculationsDetailsDelinked.fileMask]: etlConfig.calculationsDetailsDelinked.folder,
  [etlConfig.cssContractApplicationsDelinked.fileMask]: etlConfig.cssContractApplicationsDelinked.folder,
  [etlConfig.cssContractDelinked.fileMask]: etlConfig.cssContractDelinked.folder,
  [etlConfig.cssOptionsDelinked.fileMask]: etlConfig.cssOptionsDelinked.folder,
  [etlConfig.defraLinksDelinked.fileMask]: etlConfig.defraLinksDelinked.folder,
  [etlConfig.financeDAXDelinked.fileMask]: etlConfig.financeDAXDelinked.folder,
  [etlConfig.organisationDelinked.fileMask]: etlConfig.organisationDelinked.folder,
  [etlConfig.tclcOptionDelinked.fileMask]: etlConfig.tclcOptionDelinked.folder,
  [etlConfig.tclcDelinked.fileMask]: etlConfig.tclcDelinked.folder,
  [etlConfig.appCalculationResultsDelinkPayments.fileMask]: etlConfig.appCalculationResultsDelinkPayments.folder,
  [etlConfig.tdeLinkingTransferTransactions.fileMask]: etlConfig.tdeLinkingTransferTransactions.folder
}

const getOutputPathFromFileName = (fileName) => {
  let outputPath
  for (const [key, value] of Object.entries(FILE_PATH_LOOKUP)) {
    if (fileName.match(new RegExp(key))) {
      outputPath = value
      break
    }
  }
  return outputPath
}

const prepareDWHExtracts = async () => {
  try {
    await unzipDWHExtracts()
    const extracts = await getDWHExtracts()
    for (const extract of extracts) {
      const fileName = extract.replace(`${etlConfig.etlExtractsFolder}/`, '')
      const outputFolder = getOutputPathFromFileName(fileName)
      if (outputFolder === undefined) {
        console.log(`No matching output folder for file: ${fileName}, deleting file`)
        await deleteFile(extract)
        continue
      }
      const moved = await moveFile(etlConfig.etlExtractsFolder, outputFolder, fileName, 'export.csv')
      if (moved === false) {
        throw new Error(`Failed to move file: ${fileName}`)
      }
    }
  } catch (err) {
    await quarantineAllFiles()
    await createAlerts({
      process: 'prepareDWHExtracts',
      message: err.message
    })
  }
}

module.exports = {
  prepareDWHExtracts
}
