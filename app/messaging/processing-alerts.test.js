jest.mock('../../app/messaging/create-alerts', () => ({
  createAlerts: jest.fn()
}))

const createAlertsMock = require('../../app/messaging/create-alerts').createAlerts

const processingAlerts = require('../../app/messaging/processing-alerts')

describe('processing-alerts', () => {
  const { deriveAlertData, dataProcessingAlert } = processingAlerts

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    if (console.error && console.error.mockRestore) {
      console.error.mockRestore()
    }
  })

  describe('deriveAlertData', () => {
    test('keeps existing message and does not change error', () => {
      const payload = { process: 'ETL', message: 'already provided', error: 'original' }
      const out = deriveAlertData(payload, 'ETL')
      expect(out.process).toBe('ETL')
      expect(out.message).toBe('already provided')
      expect(out.error).toBe('original')
    })

    test('treats blank message as missing and uses error string, clears error', () => {
      const payload = { process: 'P', message: '  ', error: 'boom' }
      const out = deriveAlertData(payload, 'P')
      expect(out.message).toBe('boom')
      expect(out.error).toBeNull()
      expect(out.process).toBe('P')
    })

    test('error as string becomes message and error is cleared', () => {
      const payload = { process: 'PROC', error: 'failed because of X' }
      const out = deriveAlertData(payload, 'PROC')
      expect(out.message).toBe('failed because of X')
      expect(out.error).toBeNull()
      expect(out.process).toBe('PROC')
    })

    test('error as Error instance: message set, error retained', () => {
      const err = new Error('boom!')
      const payload = { process: 'JOB', error: err }
      const out = deriveAlertData(payload, 'JOB')
      expect(out.message).toBe('boom!')
      expect(out.error).toBe(err)
    })

    test('error as object with message property: message set, error retained', () => {
      const errObj = { message: 'obj message', code: 42 }
      const payload = { process: 'JOB2', error: errObj }
      const out = deriveAlertData(payload, 'JOB2')
      expect(out.message).toBe('obj message')
      expect(out.error).toBe(errObj)
    })

    test('no message and no error yields default "Failed processing <process>" message', () => {
      const payload = { process: 'NOERR' }
      const out = deriveAlertData(payload, 'NOERR')
      expect(out.message).toBe('Failed processing NOERR')
      expect(Object.hasOwn(out, 'error')).toBe(false)
    })
  })

  describe('dataProcessingAlert (integration behaviour with createAlerts)', () => {
    test('calls createAlerts with derived alert on success', async () => {
      createAlertsMock.mockResolvedValueOnce()
      const payload = { process: 'MYPROC', error: 'boom' }
      await expect(dataProcessingAlert(payload)).resolves.toBeUndefined()
      expect(createAlertsMock).toHaveBeenCalledTimes(1)
      const calledWith = createAlertsMock.mock.calls[0][0]
      expect(Array.isArray(calledWith)).toBe(true)
      expect(calledWith[0].process).toBe('MYPROC')
      expect(calledWith[0].message).toBe('boom')
    })

    test('when createAlerts rejects and throwOnPublishError is false it logs and does not throw', async () => {
      const err = new Error('publish fail')
      createAlertsMock.mockRejectedValueOnce(err)
      const payload = { process: 'PROC_LOG', error: 'err' }

      await expect(dataProcessingAlert(payload, undefined, { throwOnPublishError: false })).resolves.toBeUndefined()
      expect(createAlertsMock).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledTimes(1)
      const logged = console.error.mock.calls[0][0]
      expect(String(logged)).toMatch(/Failed to publish processing alert for/)
      expect(String(logged)).toMatch(/PROC_LOG|unknown/)
    })

    test('when createAlerts rejects and throwOnPublishError is true it re-throws', async () => {
      const err = new Error('publish fail 2')
      createAlertsMock.mockRejectedValueOnce(err)
      const payload = { process: 'PROC_THROW', error: 'err' }

      await expect(dataProcessingAlert(payload, undefined, { throwOnPublishError: true })).rejects.toBe(err)
      expect(createAlertsMock).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledTimes(1)
    })

    test('invalid payload (no process) results in TypeError', async () => {
      await expect(dataProcessingAlert()).rejects.toThrow(TypeError)
      await expect(dataProcessingAlert({ notProcess: 123 })).rejects.toThrow(TypeError)
    })
  })
})
