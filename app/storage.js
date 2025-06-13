const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./config/etl')

let blobServiceClient
let containersInitialised
let foldersInitialised

const folderList = []

if (config.sfi23Enabled) {
  console.log('Include SFI 23 folders')
  folderList.push(
    config.applicationDetail.folder,
    config.appsPaymentNotification.folder,
    config.appsTypes.folder,
    config.businessAddress.folder,
    config.calculationsDetails.folder,
    config.cssContractApplications.folder,
    config.cssContract.folder,
    config.cssOptions.folder,
    config.defraLinks.folder,
    config.financeDAX.folder,
    config.organisation.folder,
    config.tclcOption.folder
  )
}

if (config.delinkedEnabled) {
  console.log('Include Delinked folders')
  folderList.push(
    config.applicationDetailDelinked.folder,
    config.appsPaymentNotificationDelinked.folder,
    config.appsTypesDelinked.folder,
    config.businessAddressDelinked.folder,
    config.calculationsDetailsDelinked.folder,
    config.cssContractApplicationsDelinked.folder,
    config.cssContractDelinked.folder,
    config.cssOptionsDelinked.folder,
    config.defraLinksDelinked.folder,
    config.financeDAXDelinked.folder,
    config.organisationDelinked.folder,
    config.tclcOptionDelinked.folder,
    config.tclcDelinked.folder,
    config.appCalculationResultsDelinkPayments.folder,
    config.tdeLinkingTransferTransactions.folder
  )
}

if (config.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${config.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential({ managedIdentityClientId: config.managedIdentityClientId }))
}

const container = blobServiceClient.getContainerClient(config.container)

const initialiseContainers = async () => {
  if (config.createContainers) {
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()
    console.log('Containers ready')
  }
  foldersInitialised ?? await initialiseFolders()
  containersInitialised = true
}

const initialiseFolders = async () => {
  console.log('Making sure folders exist')
  const placeHolderText = 'Placeholder'
  const blobClient = container.getBlockBlobClient(`${config.dwhExtractsFolder}/default.txt`)
  await blobClient.upload(placeHolderText, placeHolderText.length)
  foldersInitialised = true
  console.log('Folders ready')
}

const getFileList = async () => {
  containersInitialised ?? await initialiseContainers()

  const fileList = []
  for (const folder of folderList) {
    for await (const file of container.listBlobsFlat({ prefix: folder })) {
      if (file.name === `${folder}/export.csv`) {
        console.log(`Identified file: ${file.name}`)
        fileList.push(file.name)
      }
    }
  }
  return fileList
}

const getBlob = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  console.log(`Getting blob for filename: ${filename}`)
  try {
    const blob = container.getBlockBlobClient(filename)
    return blob
  } catch (e) {
    console.log(`An error occurred trying to get blob: ${e.message}`)
    throw e
  }
}

const downloadFileAsStream = async (filename) => {
  console.log(`Downloading file as stream: ${filename}`)
  try {
    const blob = await getBlob(filename)
    const downloadResponse = await blob.download(0)
    return downloadResponse.readableStreamBody
  } catch (e) {
    console.log(`An error occurred trying to download blob: ${e.message}`)
    throw e
  }
}

const deleteFile = async (filename) => {
  console.log(`Deleting file: ${filename}`)
  try {
    const blob = await getBlob(filename)
    await blob.delete()
    console.log(`File deleted: ${filename}`)
    return true
  } catch (e) {
    console.log(`An error occurred trying to delete blob: ${e.message}`)
    return false
  }
}

const getDWHExtracts = async () => {
  containersInitialised ?? await initialiseContainers()
  const fileList = []
  for await (const file of container.listBlobsFlat({ prefix: config.dwhExtractsFolder })) {
    if (file.name.endsWith('.csv')) {
      console.log(`Identified DWH extract: ${file.name}`)
      fileList.push(file.name)
    }
  }
  return fileList
}

const getETLExtractFilesFromFolder = async (folder) => {
  const files = []
  for await (const file of container.listBlobsFlat({ prefix: folder })) {
    if (file.name.endsWith('export.csv')) {
      files.push(file.name)
    }
  }
  return files
}

const deleteAllETLExtracts = async () => {
  containersInitialised ?? await initialiseContainers()
  console.log('Deleting all ETL extracts')
  try {
    const filesToDelete = []
    for (const folder of folderList) {
      const files = await getETLExtractFilesFromFolder(folder)
      filesToDelete.push(...files)
    }

    const deletePromises = filesToDelete.map(name => {
      console.log(`Deleting file: ${name}`)
      const blob = container.getBlockBlobClient(name)
      return blob.delete()
    })

    await Promise.all(deletePromises)
    console.log('All ETL extracts deleted')
    return true
  } catch (e) {
    console.log(`An error occurred trying to delete ETL extracts: ${e.message}`)
    return false
  }
}

const moveFile = async (sourceFolder, destinationFolder, sourceFilename, destinationFilename) => {
  const sourceBlob = await getBlob(`${sourceFolder}/${sourceFilename}`)
  const destinationBlob = await getBlob(`${destinationFolder}/${destinationFilename}`)
  const copyResult = await (await destinationBlob.beginCopyFromURL(sourceBlob.url)).pollUntilDone()

  if (copyResult.copyStatus === 'success') {
    await sourceBlob.delete()
    return true
  }

  return false
}

module.exports = {
  getFileList,
  downloadFileAsStream,
  deleteFile,
  getDWHExtracts,
  moveFile,
  getBlob,
  deleteAllETLExtracts,
  initialiseContainers,
  initialiseFolders,
  getETLExtractFilesFromFolder
}
