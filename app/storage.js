const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./config/storage')

let blobServiceClient
let containersInitialised
let foldersInitialised
const folderList = [
  config.applicationDetail.folder,
  config.appsPaymentNotification.folder,
  config.appsTypes.folder,
  config.businessAddress.folder,
  config.calculationsDetails.folder,
  config.calcResultsDelinkPayments.folder,
  config.cssContractApplications.folder,
  config.cssContract.folder,
  config.cssOptions.folder,
  config.defraLinks.folder,
  config.financeDAX.folder,
  config.organisation.folder,
  config.tclcOption.folder,
  config.tdeLinkingFolder
]

if (config.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${config.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
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
  return container.getBlockBlobClient(filename)
}

const downloadFile = async (filename, tempFilePath) => {
  const blob = await getBlob(filename)
  return blob.downloadToFile(tempFilePath)
}

const deleteFile = async (filename) => {
  const blob = await getBlob(filename)
  try {
    await blob.delete()
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
  downloadFile,
  deleteFile,
  getDWHExtracts,
  moveFile,
  getBlob
}
