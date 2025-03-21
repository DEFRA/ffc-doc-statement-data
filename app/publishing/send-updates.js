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
    reading: false,
    read(size) {
      if (this.reading) {
        return
      }

      this.reading = true

      getUnpublished(size)
        .then(batch => {
          if (!batch || !Array.isArray(batch)) {
            console.warn(`Invalid batch returned for ${type}`)
            this.push(null)
            this.reading = false
            return
          }

          for (const item of batch) {
            this.push(item)
          }

          if (batch.length < size) {
            this.push(null)
          }
          this.reading = false
        })
        .catch(error => {
          console.error(`Error in read stream for ${type}:`, error)
          this.reading = false
          this.destroy(error)
        })
    }
  })

  const processStream = new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const sanitizedUpdate = removeDefunctValues(chunk)
      sanitizedUpdate.type = type
      const isValid = validateUpdate(sanitizedUpdate, type)

      if (isValid) {
        sendMessage(sanitizedUpdate, type)
          .then(() => {
            const primaryKey = getPrimaryKeyValue(chunk, type)
            return updatePublished(primaryKey)
          })
          .then(() => {
            totalPublished++
            callback()
          })
          .catch(error => callback(error))
      } else {
        callback()
      }
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
  }
}

module.exports = sendUpdates
