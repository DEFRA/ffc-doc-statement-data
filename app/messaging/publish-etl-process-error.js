const util = require('util')
const { ETL_PROCESS_ERROR } = require('../constants/message-types')
const sendMessage = require('../messaging/send-message')
const config = require('../config')
const { v4: uuidv4 } = require('uuid')

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
    ...options,
    ...{
      type: ETL_PROCESS_ERROR,
      source: config.publishEtlProcessError.source
    }
  }

  await sendMessage(body, ETL_PROCESS_ERROR, config.publishEtlProcessError, options)
  console.log('Message sent:', util.inspect(body, false, null, true))
}

module.exports = publishEtlProcessError
