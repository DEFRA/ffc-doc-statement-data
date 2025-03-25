const { pipeline, Readable, Transform } = require('stream')
const util = require('util')
const pipelineAsync = util.promisify(pipeline)

const getPrimaryKeyValue = require('./get-primary-key-value')
const sendMessage = require('./send-message')
const removeDefunctValues = require('./remove-defunct-values')
const validateUpdate = require('./validate-update')

async function * ensureAsyncIterable (source) {
  if (source && typeof source[Symbol.asyncIterator] === 'function') {
    yield * source
  } else if (source && typeof source[Symbol.iterator] === 'function') {
    for (const item of source) {
      yield item
    }
  } else {
    const result = await source
    if (result && typeof result[Symbol.iterator] === 'function') {
      for (const item of result) {
        yield item
      }
    } else {
      yield result
    }
  }
}

const sendUpdates = async (type) => {
  const getUnpublished = require(`./${type}/get-unpublished`)
  const updatePublished = require(`./${type}/update-published`)
  let totalPublished = 0

  const unpublishedIterable = ensureAsyncIterable(getUnpublished())
  const readable = Readable.from(unpublishedIterable, { objectMode: true })

  const processTransform = new Transform({
    objectMode: true,
    async transform (unpublished, _encoding, callback) {
      try {
        const sanitizedUpdate = removeDefunctValues(unpublished)
        sanitizedUpdate.type = type

        if (!validateUpdate(sanitizedUpdate, type)) {
          console.warn(`Skipping invalid update for ${type} (id: ${unpublished.id || 'unknown'})`)
          return callback()
        }
        await sendMessage(sanitizedUpdate, type)
        const primaryKey = getPrimaryKeyValue(unpublished, type)
        await updatePublished(primaryKey)
        totalPublished++
        callback(null, unpublished)
      } catch (err) {
        console.error(`Error processing update for ${type} (id: ${unpublished?.id || 'unknown'}):`, err)
        callback()
      }
    }
  })

  try {
    await pipelineAsync(
      readable,
      processTransform
    )
    console.log('%i %s datasets published', totalPublished, type)
  } catch (err) {
    console.error(`Error during processing pipeline for ${type}:`, err)
  }
}

module.exports = sendUpdates
