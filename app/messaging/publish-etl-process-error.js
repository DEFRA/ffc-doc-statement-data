const { ETL_PROCESS_ERROR } = require('../constants/message-types')
const sendMessage = require('./send-message')
const config = require('../config')
const { randomUUID } = require('node:crypto')
const { DOC_STATEMENT_DATA_SOURCE } = require('../constants/doc-statement-data-source')

const publishEtlProcessError = async (file, error) => {
  const options = {
    time: new Date(),
    id: randomUUID()
  }

  const body = {
    data: {
      message: error.message,
      file
    },
    ...options
  }

  await sendMessage(body, ETL_PROCESS_ERROR, DOC_STATEMENT_DATA_SOURCE, config.publishEtlProcessError, options)
  console.log(`ETL error message sent — id: ${body.id}, file: ${body.data?.file}`)
}

module.exports = publishEtlProcessError
