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
  [etlConfig.tclc.fileMask]: etlConfig.tclc.folder
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
