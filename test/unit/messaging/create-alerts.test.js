jest.mock('ffc-pay-event-publisher')
const { EventPublisher } = require('ffc-pay-event-publisher')

const { SOURCE } = require('../../../app/constants/source')
const { ETL_PROCESS_ERROR } = require('../../../app/constants/alerts')
const { createAlerts, createAlert } = require('../../../app/messaging/create-alerts')

describe('create-alerts', () => {
  const mockPublishEvents = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    EventPublisher.mockImplementation(() => {
      return {
        publishEvents: mockPublishEvents
      }
    })
  })

  test('should not create any alerts when no errors provided', async () => {
    await createAlerts()
    expect(EventPublisher).not.toHaveBeenCalled()
    expect(mockPublishEvents).not.toHaveBeenCalled()
  })

  test('should not create any alerts when empty errors array provided', async () => {
    await createAlerts([])
    expect(EventPublisher).not.toHaveBeenCalled()
    expect(mockPublishEvents).not.toHaveBeenCalled()
  })

  test('should create alert with correct format for single error', async () => {
    const error = { file: 'test.csv', message: 'Test error' }

    await createAlerts([error])

    expect(EventPublisher).toHaveBeenCalledTimes(1)
    expect(mockPublishEvents).toHaveBeenCalledWith([{
      source: SOURCE,
      type: ETL_PROCESS_ERROR,
      data: {
        file: 'test.csv',
        message: 'Test error'
      }
    }])
  })

  test('should create multiple alerts when multiple errors provided', async () => {
    const errors = [
      { file: 'test1.csv', message: 'Test error 1' },
      { file: 'test2.csv', message: 'Test error 2' }
    ]

    await createAlerts(errors)

    expect(EventPublisher).toHaveBeenCalledTimes(1)
    expect(mockPublishEvents).toHaveBeenCalledWith([
      {
        source: SOURCE,
        type: ETL_PROCESS_ERROR,
        data: {
          file: 'test1.csv',
          message: 'Test error 1'
        }
      },
      {
        source: SOURCE,
        type: ETL_PROCESS_ERROR,
        data: {
          file: 'test2.csv',
          message: 'Test error 2'
        }
      }
    ])
  })

  test('should throw error if event publishing fails', async () => {
    const error = { file: 'test.csv', message: 'Test error' }
    const publishError = new Error('Failed to publish')
    mockPublishEvents.mockRejectedValue(publishError)

    await expect(createAlerts([error])).rejects.toThrow(publishError)
  })

  test('should use error.message if present', () => {
    const error = { message: 'Test error', code: 123 }
    const alert = createAlert(error, ETL_PROCESS_ERROR)
    expect(alert.data.message).toBe('Test error')
    expect(alert.data.code).toBe(123)
    expect(alert.source).toBe(SOURCE)
    expect(alert.type).toBe(ETL_PROCESS_ERROR)
  })

  test('should set data.message to error object if message is missing', () => {
    const error = { code: 456 }
    const alert = createAlert(error, ETL_PROCESS_ERROR)
    expect(alert.data.message).toEqual(alert.data)
    expect(alert.data.code).toBe(456)
    expect(alert.source).toBe(SOURCE)
    expect(alert.type).toBe(ETL_PROCESS_ERROR)
  })
})
