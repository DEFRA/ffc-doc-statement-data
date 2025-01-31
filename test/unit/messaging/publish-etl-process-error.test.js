const publishEtlProcessError = require('../../../app/messaging/publish-etl-process-error')
const sendMessage = require('../../../app/messaging/send-message')
const { v4: uuidv4 } = require('uuid')
const config = require('../../../app/config')
const { ETL_PROCESS_ERROR } = require('../../../app/constants/message-types')

jest.mock('uuid')
jest.mock('../../../app/messaging/send-message')
jest.mock('../../../app/config')

describe('publishEtlProcessError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    uuidv4.mockReturnValue('mock-uuid')
    config.publishEtlProcessError = { source: 'mock-source' }
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  test('should construct the correct body and call sendMessage', async () => {
    const file = 'mock-file'
    const error = new Error('mock-error')

    await publishEtlProcessError(file, error)

    const expectedBody = {
      data: {
        message: 'mock-error',
        file: 'mock-file'
      },
      time: expect.any(Date),
      id: 'mock-uuid',
      type: ETL_PROCESS_ERROR,
      source: 'mock-source'
    }

    expect(sendMessage).toHaveBeenCalledWith(expectedBody, ETL_PROCESS_ERROR, config.publishEtlProcessError, {
      time: expect.any(Date),
      id: 'mock-uuid'
    })
  })
})
