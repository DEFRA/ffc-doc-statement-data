jest.mock('../../../app/messaging/create-alerts')
const { createAlerts } = require('../../../app/messaging/create-alerts')

const { dataProcessingAlert, deriveAlertData } = require('../../../app/messaging/processing-alerts')
const { DATA_PROCESSING_ERROR } = require('../../../app/constants/alerts')

describe('processing-alerts', () => {
  const mockCreateAlerts = jest.fn()
  let consoleErrorSpy

  beforeEach(() => {
    jest.clearAllMocks()
    createAlerts.mockImplementation(mockCreateAlerts)
    mockCreateAlerts.mockResolvedValue()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('validatePayload (via dataProcessingAlert)', () => {
    test('should throw TypeError for null payload', async () => {
      await expect(dataProcessingAlert(null)).rejects.toThrow(TypeError)
      await expect(dataProcessingAlert(null)).rejects.toThrow('payload must be an object with at least a `process` property')
    })

    test('should throw TypeError for undefined payload', async () => {
      await expect(dataProcessingAlert(undefined)).rejects.toThrow(TypeError)
      await expect(dataProcessingAlert(undefined)).rejects.toThrow('payload.process (string) is required')
    })

    test('should throw TypeError for string payload', async () => {
      await expect(dataProcessingAlert('string')).rejects.toThrow(TypeError)
      await expect(dataProcessingAlert('string')).rejects.toThrow('payload must be an object with at least a `process` property')
    })

    test('should throw TypeError for number payload', async () => {
      await expect(dataProcessingAlert(123)).rejects.toThrow(TypeError)
      await expect(dataProcessingAlert(123)).rejects.toThrow('payload must be an object with at least a `process` property')
    })

    test('should throw TypeError for missing process', async () => {
      await expect(dataProcessingAlert({})).rejects.toThrow(TypeError)
      await expect(dataProcessingAlert({})).rejects.toThrow('payload.process (string) is required')
    })

    test('should throw TypeError for null process', async () => {
      await expect(dataProcessingAlert({ process: null })).rejects.toThrow(TypeError)
      await expect(dataProcessingAlert({ process: null })).rejects.toThrow('payload.process (string) is required')
    })

    test('should throw TypeError for empty string process', async () => {
      await expect(dataProcessingAlert({ process: '' })).rejects.toThrow(TypeError)
      await expect(dataProcessingAlert({ process: '' })).rejects.toThrow('payload.process (string) is required')
    })

    test('should throw TypeError for non-string process', async () => {
      await expect(dataProcessingAlert({ process: 123 })).rejects.toThrow(TypeError)
      await expect(dataProcessingAlert({ process: 123 })).rejects.toThrow('payload.process (string) is required')
    })
  })

  describe('needsMessage (via deriveAlertData)', () => {
    test('should return false when message property exists and is valid', () => {
      const payload = { process: 'test', message: 'existing message' }
      const result = deriveAlertData(payload, 'test')
      expect(result.message).toBe('existing message')
    })

    test('should return true when message property does not exist', () => {
      const payload = { process: 'test', error: 'some error' }
      const result = deriveAlertData(payload, 'test')
      expect(result.message).toBe('some error')
    })

    test('should return true when message is null', () => {
      const payload = { process: 'test', message: null, error: 'some error' }
      const result = deriveAlertData(payload, 'test')
      expect(result.message).toBe('some error')
    })

    test('should return true when message is undefined', () => {
      const payload = { process: 'test', message: undefined, error: 'some error' }
      const result = deriveAlertData(payload, 'test')
      expect(result.message).toBe('some error')
    })

    test('should return true when message is empty string', () => {
      const payload = { process: 'test', message: '', error: 'some error' }
      const result = deriveAlertData(payload, 'test')
      expect(result.message).toBe('some error')
    })

    test('should return true when message is whitespace only', () => {
      const payload = { process: 'test', message: '   ', error: 'some error' }
      const result = deriveAlertData(payload, 'test')
      expect(result.message).toBe('some error')
    })

    test('should return true when message is tabs and spaces', () => {
      const payload = { process: 'test', message: '\t\n  ', error: 'some error' }
      const result = deriveAlertData(payload, 'test')
      expect(result.message).toBe('some error')
    })
  })

  describe('extractMessage (via deriveAlertData)', () => {
    test('should extract message from Error object', () => {
      const error = new Error('Error message')
      const payload = { process: 'test', error }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'Error message', error })
    })

    test('should use default message for Error with empty message', () => {
      const error = new Error('')
      const payload = { process: 'test', error }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'Failed processing test', error })
    })

    test('should use default message for Error with no message', () => {
      const error = new Error()
      const payload = { process: 'test', error }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'Failed processing test', error })
    })

    test('should extract message from object with message property', () => {
      const payload = { process: 'test', error: { message: 'Object message' } }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'Object message', error: { message: 'Object message' } })
    })

    test('should ignore object without message property', () => {
      const payload = { process: 'test', error: { code: 'ERROR_CODE' } }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'Failed processing test', error: { code: 'ERROR_CODE' } })
    })

    test('should ignore object with non-string message', () => {
      const payload = { process: 'test', error: { message: 123 } }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'Failed processing test', error: { message: 123 } })
    })

    test('should extract message from string and clear error', () => {
      const payload = { process: 'test', error: 'String error' }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'String error', error: null })
    })

    test('should use default message for non-string, non-object, non-Error values', () => {
      const payload = { process: 'test', error: 123 }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'Failed processing test', error: 123 })
    })

    test('should use default message for boolean error', () => {
      const payload = { process: 'test', error: true }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'Failed processing test', error: true })
    })

    test('should use default message for array error', () => {
      const payload = { process: 'test', error: ['error1', 'error2'] }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'Failed processing test', error: ['error1', 'error2'] })
    })

    test('should use default message when no error present', () => {
      const payload = { process: 'test' }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'Failed processing test', error: undefined })
    })
  })

  describe('deriveAlertData', () => {
    test('should return alertData unchanged if message exists and is valid', () => {
      const payload = { process: 'test', message: 'existing message', error: 'some error' }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({ process: 'test', message: 'existing message', error: 'some error' })
    })

    test('should preserve additional properties in payload', () => {
      const payload = { process: 'test', customProp: 'value', anotherProp: 123, error: 'String error' }
      const result = deriveAlertData(payload, 'test')
      expect(result).toEqual({
        process: 'test',
        customProp: 'value',
        anotherProp: 123,
        message: 'String error',
        error: null
      })
    })

    test('should override process name from parameter', () => {
      const payload = { process: 'original', message: 'test message' }
      const result = deriveAlertData(payload, 'overridden')
      expect(result).toEqual({ process: 'overridden', message: 'test message' })
    })
  })

  describe('publish (via dataProcessingAlert)', () => {
    test('should call createAlerts with correct parameters', async () => {
      const payload = { process: 'test', message: 'Test alert' }
      await dataProcessingAlert(payload)
      expect(mockCreateAlerts).toHaveBeenCalledWith([{ process: 'test', message: 'Test alert' }], DATA_PROCESSING_ERROR)
    })

    test('should log error and not throw when throwOnPublishError is false', async () => {
      const payload = { process: 'test', message: 'Test alert' }
      const error = new Error('Publish failed')
      mockCreateAlerts.mockRejectedValue(error)

      await expect(dataProcessingAlert(payload, DATA_PROCESSING_ERROR, { throwOnPublishError: false })).resolves.toBeUndefined()

      expect(mockCreateAlerts).toHaveBeenCalled()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to publish processing alert for test', error)
    })

    test('should log error with unknown process when payload array is malformed', async () => {
      const payload = { process: 'test', message: 'Test alert' }
      const error = new Error('Publish failed')
      mockCreateAlerts.mockRejectedValue(error)
      mockCreateAlerts.mockImplementation(() => {
        throw error
      })

      await expect(dataProcessingAlert(payload, DATA_PROCESSING_ERROR, { throwOnPublishError: false })).resolves.toBeUndefined()

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to publish processing alert for test', error)
    })

    test('should throw error when throwOnPublishError is true', async () => {
      const payload = { process: 'test', message: 'Test alert' }
      const error = new Error('Publish failed')
      mockCreateAlerts.mockRejectedValue(error)

      await expect(dataProcessingAlert(payload, DATA_PROCESSING_ERROR, { throwOnPublishError: true })).rejects.toThrow(error)

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to publish processing alert for test', error)
    })
  })

  describe('dataProcessingAlert', () => {
    test('should process valid payload and publish alert with defaults', async () => {
      const payload = { process: 'test', message: 'Test alert' }
      await dataProcessingAlert(payload)
      expect(mockCreateAlerts).toHaveBeenCalledWith([{ process: 'test', message: 'Test alert' }], DATA_PROCESSING_ERROR)
    })

    test('should derive message and publish', async () => {
      const payload = { process: 'test', error: 'Derived message' }
      await dataProcessingAlert(payload)
      expect(mockCreateAlerts).toHaveBeenCalledWith([{ process: 'test', message: 'Derived message', error: null }], DATA_PROCESSING_ERROR)
    })

    test('should use custom type', async () => {
      const payload = { process: 'test', message: 'Test alert' }
      const customType = 'CUSTOM_TYPE'
      await dataProcessingAlert(payload, customType)
      expect(mockCreateAlerts).toHaveBeenCalledWith([{ process: 'test', message: 'Test alert' }], customType)
    })

    test('should use default options when not provided', async () => {
      const payload = { process: 'test', message: 'Test alert' }
      await dataProcessingAlert(payload, DATA_PROCESSING_ERROR)
      expect(mockCreateAlerts).toHaveBeenCalledWith([{ process: 'test', message: 'Test alert' }], DATA_PROCESSING_ERROR)
    })

    test('should handle empty options object', async () => {
      const payload = { process: 'test', message: 'Test alert' }
      await dataProcessingAlert(payload, DATA_PROCESSING_ERROR, {})
      expect(mockCreateAlerts).toHaveBeenCalledWith([{ process: 'test', message: 'Test alert' }], DATA_PROCESSING_ERROR)
    })

    test('should respect throwOnPublishError option when explicitly set to false', async () => {
      const payload = { process: 'test', message: 'Test alert' }
      const error = new Error('Publish failed')
      mockCreateAlerts.mockRejectedValue(error)

      await expect(dataProcessingAlert(payload, DATA_PROCESSING_ERROR, { throwOnPublishError: false })).resolves.toBeUndefined()
    })

    test('should process complex payload with multiple properties', async () => {
      const payload = {
        process: 'complexProcess',
        data: { key: 'value' },
        timestamp: '2023-01-01',
        error: new Error('Complex error')
      }
      await dataProcessingAlert(payload)

      expect(mockCreateAlerts).toHaveBeenCalledWith([{
        process: 'complexProcess',
        data: { key: 'value' },
        timestamp: '2023-01-01',
        message: 'Complex error',
        error: new Error('Complex error')
      }], DATA_PROCESSING_ERROR)
    })
  })
})
