const { createAlerts } = require('./create-alerts')
const { DATA_PROCESSING_ERROR } = require('../constants/alerts')

const validatePayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new TypeError('payload must be an object with at least a `process` property')
  }
  const processName = payload.process
  if (!processName || typeof processName !== 'string') {
    throw new TypeError('payload.process (string) is required')
  }
  return processName
}

const needsMessage = (alertData) => {
  return (
    (!Object.hasOwn(alertData, 'message')) ||
    (alertData.message == null) ||
    (typeof alertData.message === 'string' && alertData.message.trim().length === 0)
  )
}

const extractMessage = (maybeError, processName) => {
  if (maybeError instanceof Error) {
    return { message: maybeError.message || `Failed processing ${processName}`, clearError: false }
  }

  if (typeof maybeError === 'object' && maybeError != null && typeof maybeError.message === 'string') {
    return { message: maybeError.message, clearError: false }
  }

  if (typeof maybeError === 'string') {
    return { message: maybeError, clearError: true }
  }

  return { message: `Failed processing ${processName}`, clearError: false }
}

const deriveAlertData = (payload, processName) => {
  const alertData = { ...payload, process: processName }

  if (!needsMessage(alertData)) {
    return alertData
  }

  const maybeError = alertData.error
  const { message, clearError } = extractMessage(maybeError, processName)

  alertData.message = message
  if (clearError) {
    alertData.error = null
  }

  alertData.plain_text = message

  return alertData
}

const publish = async (alertPayloadArray, type, throwOnPublishError) => {
  try {
    await createAlerts(alertPayloadArray, type)
  } catch (err) {
    console.error(`Failed to publish processing alert for ${alertPayloadArray?.[0]?.process ?? 'unknown'}`, err)
    if (throwOnPublishError) {
      throw err
    }
  }
}

const dataProcessingAlert = async (payload = {}, type = DATA_PROCESSING_ERROR, options = {}) => {
  const processName = validatePayload(payload)
  const { throwOnPublishError = false } = options
  const alertData = deriveAlertData(payload, processName)
  await publish([alertData], type, throwOnPublishError)
}

module.exports = {
  dataProcessingAlert,
  deriveAlertData
}
