const util = require('node:util')
const { ETL_PROCESS_ERROR } = require('../constants/message-types')
const sendMessage = require('./send-message')
const config = require('../config')
const { v4: uuidv4 } = require('uuid')
const { DOC_STATEMENT_DATA_SOURCE } = require('../constants/doc-statement-data-source')

const publishEtlProcessError = async (file, error) => {
  const options = {
    time: new Date(),
    id: uuidv4()
  }

  const body = {
    data: {
      message: error.message,
      file
    },
    ...options
  }

  await sendMessage(body, ETL_PROCESS_ERROR, DOC_STATEMENT_DATA_SOURCE, config.publishEtlProcessError, options)
  console.log('Message sent:', util.inspect(body, false, null, true))
}

module.exports = publishEtlProcessError
