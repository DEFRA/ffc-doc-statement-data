const mockRemoveDefunctValues = jest.fn((r) => ({ ...r }))
const mockValidateUpdate = jest.fn(() => true)
const mockSendMessage = jest.fn()
const mockGetPrimaryKeyValue = jest.fn(() => 'primaryKey')
const mockUpdatePublishedOrganisation = jest.fn()

jest.mock('../../../../app/publishing/remove-defunct-values', () => mockRemoveDefunctValues)
jest.mock('../../../../app/publishing/validate-update', () => mockValidateUpdate)
jest.mock('../../../../app/publishing/send-message', () => mockSendMessage)
jest.mock('../../../../app/publishing/get-primary-key-value', () => mockGetPrimaryKeyValue)
jest.mock('../../../../app/publishing/organisation/update-published', () => mockUpdatePublishedOrganisation)

const { ORGANISATION, D365 } = require('../../../../app/constants/types')
const sendSubset = require('../../../../app/publishing/subset/send-subset')

describe('sendSubset', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('publishes all valid records for each table', async () => {
    const tablesToTarget = [
      {
        type: ORGANISATION,
        dataToPublish: [
          { id: 1, foo: 'bar' },
          { id: 2, foo: 'baz' }
        ]
      },
      {
        type: D365,
        dataToPublish: [
          { id: 3, foo: 'qux' }
        ]
      }
    ]
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

    await sendSubset(tablesToTarget)

    expect(mockRemoveDefunctValues).toHaveBeenCalledTimes(3)
    expect(mockValidateUpdate).toHaveBeenCalledTimes(3)
    expect(mockSendMessage).toHaveBeenCalledTimes(3)
    expect(mockGetPrimaryKeyValue).toHaveBeenCalledTimes(3)
    expect(mockUpdatePublishedOrganisation).toHaveBeenCalledTimes(3)
    expect(logSpy).toHaveBeenCalledWith('%i %s datasets published', 2, ORGANISATION)
    expect(logSpy).toHaveBeenCalledWith('%i %s datasets published', 1, D365)
    logSpy.mockRestore()
  })

  test('skips records that are not valid', async () => {
    mockValidateUpdate.mockReturnValueOnce(false).mockReturnValue(true)
    const tablesToTarget = [
      {
        type: ORGANISATION,
        dataToPublish: [
          { id: 1, foo: 'bar' },
          { id: 2, foo: 'baz' }
        ]
      }
    ]
    await sendSubset(tablesToTarget)
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
    expect(mockUpdatePublishedOrganisation).toHaveBeenCalledTimes(1)
  })

  test('handles empty dataToPublish gracefully', async () => {
    const tablesToTarget = [
      { type: ORGANISATION, dataToPublish: [] }
    ]
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })
    await sendSubset(tablesToTarget)
    expect(mockRemoveDefunctValues).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith('%i %s datasets published', 0, ORGANISATION)
    logSpy.mockRestore()
  })
})
