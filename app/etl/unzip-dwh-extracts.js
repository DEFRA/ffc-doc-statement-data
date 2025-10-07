const unzipper = require('unzipper')
const { getZipFile, downloadFileAsStream, deleteFile, getBlob } = require('../storage')
const config = require('../config/etl')

const unzipAndUpload = async (zipStream) => {
  const uploadedFiles = []

  return new Promise((resolve, reject) => {
    zipStream
      .pipe(unzipper.Parse())
      .on('entry', async (entry) => {
        const fileName = entry.path
        if (fileName.endsWith('/')) {
          console.log(`Skipping directory: ${fileName}`)
          entry.autodrain()
          return
        }

        const baseFileName = fileName.split('/').pop()
        console.log(`Extracting file from zip: ${baseFileName}`)

        try {
          const blobClient = await getBlob(`${config.dwhExtractsFolder}/${baseFileName}`)
          await blobClient.uploadStream(entry)
          console.log(`Uploaded file to blob storage: ${baseFileName}`)
          uploadedFiles.push(baseFileName)
        } catch (err) {
          console.error(`Error processing entry ${baseFileName}: `, err)
          await Promise.all(uploadedFiles.map(async (uploadedFile) => {
            await deleteFile(`${config.dwhExtractsFolder}/${uploadedFile}`)
            console.log(`Deleted uploaded file due to error: ${uploadedFile}`)
          }))
          reject(err)
        }
      })
      .on('close', () => {
        console.log('DWH zip file successfully unzipped')
        resolve()
      })
      .on('error', (err) => {
        console.error('Error during unzipping: ', err)
        reject(err)
      })
  })
}

const unzipDWHExtracts = async () => {
  const zipFile = await getZipFile()
  if (zipFile) {
    try {
      const downloadStream = await downloadFileAsStream(zipFile)
      await unzipAndUpload(downloadStream)
      await deleteFile(zipFile)
      console.log(`Processed and deleted zip file: ${zipFile}`)
    } catch (err) {
      console.error('Failed to process DWH zip file: ', err)
      throw err
    }
  } else {
    console.log('No DWH zip file identified for processing')
  }
}

module.exports = {
  unzipDWHExtracts
}
