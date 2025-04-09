const { etlConfig } = require('../config')
const { getDWHExtracts, moveFile } = require('../storage')

const FILE_PATH_LOOKUP = {
  [etlConfig.applicationDetail.fileMask]: etlConfig.applicationDetail.folder,
  [etlConfig.appsPaymentNotification.fileMask]: etlConfig.appsPaymentNotification.folder,
  [etlConfig.appsTypes.fileMask]: etlConfig.appsTypes.folder,
  [etlConfig.businessAddress.fileMask]: etlConfig.businessAddress.folder,
  [etlConfig.calculationsDetails.fileMask]: etlConfig.calculationsDetails.folder,
  [etlConfig.cssContractApplications.fileMask]: etlConfig.cssContractApplications.folder,
  [etlConfig.cssContract.fileMask]: etlConfig.cssContract.folder,
  [etlConfig.cssOptions.fileMask]: etlConfig.cssOptions.folder,
  [etlConfig.defraLinks.fileMask]: etlConfig.defraLinks.folder,
  [etlConfig.financeDAX.fileMask]: etlConfig.financeDAX.folder,
  [etlConfig.organisation.fileMask]: etlConfig.organisation.folder,
  [etlConfig.tclcOption.fileMask]: etlConfig.tclcOption.folder,
  [etlConfig.tclc.fileMask]: etlConfig.tclc.folder,
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

const renameExtracts = async () => {
  const extracts = await getDWHExtracts()
  for (const extract of extracts) {
    const fileName = extract.replace(`${etlConfig.dwhExtractsFolder}/`, '')
    const outputFolder = getOutputPathFromFileName(fileName)
    await moveFile(etlConfig.dwhExtractsFolder, outputFolder, fileName, 'export.csv')
  }
}

module.exports = {
  renameExtracts
}
