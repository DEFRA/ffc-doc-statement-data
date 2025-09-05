jest.mock('ffc-pay-event-publisher')
const { EventPublisher } = require('ffc-pay-event-publisher')

const { SOURCE } = require('../../../app/constants/source')
const { ETL_PROCESS_ERROR } = require('../../../app/constants/alerts')
const { createAlerts } = require('../../../app/messaging/create-alerts')

describe('create-alerts', () => {
  const mockPublishEvents = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockPublishEvents.mockResolvedValue() // Ensure it resolves by default
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
    const error = { message: 'Test error', error: 'Some error' }

    await createAlerts([error])

    expect(EventPublisher).toHaveBeenCalledTimes(1)
    expect(mockPublishEvents).toHaveBeenCalledWith([{
      source: SOURCE,
      type: ETL_PROCESS_ERROR,
      data: {
        message: 'Test error',
        error: 'Some error'
      }
    }])
  })

  test('should create multiple alerts when multiple errors provided', async () => {
    const errors = [
      { message: 'Test error 1', error: 'Error 1' },
      { message: 'Test error 2', error: 'Error 2' }
    ]

    await createAlerts(errors)

    expect(EventPublisher).toHaveBeenCalledTimes(1)
    expect(mockPublishEvents).toHaveBeenCalledWith([
      {
        source: SOURCE,
        type: ETL_PROCESS_ERROR,
        data: {
          message: 'Test error 1',
          error: 'Error 1'
        }
      },
      {
        source: SOURCE,
        type: ETL_PROCESS_ERROR,
        data: {
          message: 'Test error 2',
          error: 'Error 2'
        }
      }
    ])
  })

  test('should throw error if event publishing fails', async () => {
    const error = { message: 'Test error', error: 'Some error' }
    const publishError = new Error('Failed to publish')
    mockPublishEvents.mockRejectedValue(publishError)

    await expect(createAlerts([error])).rejects.toThrow(publishError)
  })

  test('should handle pre-formed alert objects with all fields', async () => {
    const alerts = [
      {
        source: 'custom-source',
        type: 'custom-type',
        data: { message: 'Custom alert', error: 'Custom error' }
      }
    ]

    await createAlerts(alerts)

    expect(EventPublisher).toHaveBeenCalledTimes(1)
    expect(mockPublishEvents).toHaveBeenCalledWith(alerts)
  })

  test('should handle pre-formed alert objects with missing fields using defaults', async () => {
    const alerts = [
      {
        type: 'custom-type',
        data: { message: 'Partial alert', error: 'Partial error' }
      }
    ]

    await createAlerts(alerts)

    expect(EventPublisher).toHaveBeenCalledTimes(1)
    expect(mockPublishEvents).toHaveBeenCalledWith([
      {
        source: SOURCE,
        type: 'custom-type',
        data: { message: 'Partial alert', error: 'Partial error' }
      }
    ])
  })

  test('should use custom type when provided', async () => {
    const error = { message: 'Test error', error: 'Some error' }
    const customType = 'CUSTOM_ERROR'

    await createAlerts([error], customType)

    expect(EventPublisher).toHaveBeenCalledTimes(1)
    expect(mockPublishEvents).toHaveBeenCalledWith([{
      source: SOURCE,
      type: customType,
      data: {
        message: 'Test error',
        error: 'Some error'
      }
    }])
  })

  test('should handle multiple pre-formed alerts', async () => {
    const alerts = [
      {
        source: 'source1',
        type: 'type1',
        data: { message: 'alert1', error: 'error1' }
      },
      {
        source: 'source2',
        type: 'type2',
        data: { message: 'alert2', error: 'error2' }
      }
    ]

    await createAlerts(alerts)

    expect(EventPublisher).toHaveBeenCalledTimes(1)
    expect(mockPublishEvents).toHaveBeenCalledWith(alerts)
  })
})
