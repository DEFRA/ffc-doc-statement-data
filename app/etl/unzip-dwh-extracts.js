const unzipper = require('unzipper')
const { getZipFile, downloadFileAsStream, deleteFile, getBlob } = require('../storage')
const config = require('../config/etl')

const clearAllUploads = async (uploadedFiles) => {
  await Promise.all(
    uploadedFiles.map(async (uploadedFile) => {
      await deleteFile(`${config.dwhExtractsFolder}/${uploadedFile}`)
      console.log(`Deleted uploaded file due to error: ${uploadedFile}`)
    })
  )
}

const unzipAndUpload = (zipStream) => {
  const uploadedFiles = []
  const uploadPromises = []

  return new Promise((resolve, reject) => {
    zipStream
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        const fileName = entry.path
        if (entry.type === 'Directory' || fileName.endsWith('/')) {
          console.log(`Skipping directory: ${fileName}`)
          entry.autodrain()
          return
        }

        const baseFileName = fileName.split('/').pop()
        console.log(`Extracting file from zip: ${baseFileName}`)

        const uploadPromise = getBlob(`${config.dwhExtractsFolder}/${baseFileName}`)
          .then(blobClient => blobClient.uploadStream(entry))
          .then(() => {
            console.log(`Uploaded file to blob storage: ${baseFileName}`)
            uploadedFiles.push(baseFileName)
          })
          .catch(async (err) => {
            await clearAllUploads(uploadedFiles)
            throw err
          })

        uploadPromises.push(uploadPromise)
      })
      .on('close', async () => {
        console.log('DWH zip file parsing finished, waiting for uploads to complete...')
        try {
          await Promise.all(uploadPromises)
          console.log('DWH zip file successfully unzipped and all files uploaded')
          resolve()
        } catch (err) {
          reject(err)
        }
      })
      .on('error', (err) => {
        console.error('Error during unzipping: ', err)
        reject(err)
      })
  })
}

const unzipDWHExtracts = async () => {
  const zipFile = await getZipFile()
  if (!zipFile) {
    console.log('No DWH zip file identified for processing')
    return
  }

  const downloadStream = await downloadFileAsStream(zipFile)
  await unzipAndUpload(downloadStream)
  await deleteFile(zipFile)
  console.log(`Processed and deleted zip file: ${zipFile}`)
}

module.exports = {
  unzipDWHExtracts,
  clearAllUploads
}
