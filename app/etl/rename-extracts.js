const { storageConfig } = require('../config')
const { getDWHExtracts, moveFile } = require('../storage')

const FILE_PATH_LOOKUP = {
  [storageConfig.applicationDetail.fileMask]: storageConfig.applicationDetail.folder,
  [storageConfig.appsPaymentNotification.fileMask]: storageConfig.appsPaymentNotification.folder,
  [storageConfig.appsTypes.fileMask]: storageConfig.appsTypes.folder,
  [storageConfig.businessAddress.fileMask]: storageConfig.businessAddress.folder,
  [storageConfig.calculationsDetails.fileMask]: storageConfig.calculationsDetails.folder,
  [storageConfig.calcResultsDelinkPayments.fileMask]: storageConfig.calcResultsDelinkPayments.folder,
  [storageConfig.cssContractApplications.fileMask]: storageConfig.cssContractApplications.folder,
  [storageConfig.cssContract.fileMask]: storageConfig.cssContract.folder,
  [storageConfig.cssOptions.fileMask]: storageConfig.cssOptions.folder,
  [storageConfig.defraLinks.fileMask]: storageConfig.defraLinks.folder,
  [storageConfig.financeDAX.fileMask]: storageConfig.financeDAX.folder,
  [storageConfig.organisation.fileMask]: storageConfig.organisation.folder,
  [storageConfig.tclcOption.fileMask]: storageConfig.tclcOption.folder,
  [storageConfig.tclc.fileMask]: storageConfig.tclc.folder
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
    const fileName = extract.replace(`${storageConfig.dwhExtractsFolder}/`, '')
    const outputFolder = getOutputPathFromFileName(fileName)
    await moveFile(storageConfig.dwhExtractsFolder, outputFolder, fileName, 'export.csv')
  }
}

module.exports = {
  renameExtracts
}
