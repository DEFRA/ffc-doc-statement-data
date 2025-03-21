const { Readable, Transform } = require('stream')
const { pipeline } = require('stream/promises')
const getPrimaryKeyValue = require('./get-primary-key-value')
const sendMessage = require('./send-message')
const removeDefunctValues = require('./remove-defunct-values')
const validateUpdate = require('./validate-update')

const sendUpdates = async (type) => {
  const getUnpublished = require(`./${type}/get-unpublished`)
  const updatePublished = require(`./${type}/update-published`)
  let totalPublished = 0

  const readStream = new Readable({
    objectMode: true,
    async read (size) {
      try {
        const batch = await getUnpublished(size)
        for (const item of batch) {
          this.push(item)
        }
        if (batch.length < size) {
          this.push(null)
        }
      } catch (error) {
        this.destroy(error)
      }
    }
  })

  const processStream = new Transform({
    objectMode: true,
    transform (chunk, _encoding, callback) {
      const processItem = async () => {
        try {
          const sanitizedUpdate = removeDefunctValues(chunk)
          sanitizedUpdate.type = type
          const isValid = validateUpdate(sanitizedUpdate, type)
          if (isValid) {
            await sendMessage(sanitizedUpdate, type)
            const primaryKey = getPrimaryKeyValue(chunk, type)
            await updatePublished(primaryKey)
            totalPublished++
          }
          callback()
        } catch (error) {
          callback(error)
        }
      }
      processItem()
    }
  })

  try {
    await pipeline(
      readStream,
      processStream
    )
    console.log('%i %s datasets published', totalPublished, type)
  } catch (error) {
    console.error(`Error in sendUpdates for ${type}:`, error)
    throw error
  }
}

module.exports = sendUpdates
