const mockRemoveDefunctValues = jest.fn((r) => ({ ...r }))
const mockValidateUpdate = jest.fn(() => true)
const mockSendMessage = jest.fn()
const mockGetPrimaryKeyValue = jest.fn(() => 'primaryKey')
const mockUpdatePublishedOrganisation = jest.fn()
const mockUpdatePublishedDelinkedCalculation = jest.fn()
const mockUpdatePublishedD365 = jest.fn()

jest.mock('../../../../app/publishing/remove-defunct-values', () => mockRemoveDefunctValues)
jest.mock('../../../../app/publishing/validate-update', () => mockValidateUpdate)
jest.mock('../../../../app/publishing/send-message', () => mockSendMessage)
jest.mock('../../../../app/publishing/get-primary-key-value', () => mockGetPrimaryKeyValue)
jest.mock('../../../../app/publishing/organisation/update-published', () => mockUpdatePublishedOrganisation)
jest.mock('../../../../app/publishing/delinkedCalculation/update-published', () => mockUpdatePublishedDelinkedCalculation)
jest.mock('../../../../app/publishing/d365/update-published', () => mockUpdatePublishedD365)

const { ORGANISATION, DELINKED_CALCULATION, D365 } = require('../../../../app/constants/types')
const sendSubset = require('../../../../app/publishing/subset/send-subset')

describe('sendSubset', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('publishes all valid records for each table', async () => {
    const tablesToTarget = [
      {
        type: ORGANISATION,
        dataToPublish: [{ id: 1 }]
      },
      {
        type: DELINKED_CALCULATION,
        dataToPublish: [{ id: 2 }]
      },
      {
        type: D365,
        dataToPublish: [{ id: 3 }]
      }
    ]
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

    await sendSubset(tablesToTarget)

    expect(mockRemoveDefunctValues).toHaveBeenCalledTimes(3)
    expect(mockValidateUpdate).toHaveBeenCalledTimes(3)
    expect(mockSendMessage).toHaveBeenCalledTimes(3)
    expect(mockGetPrimaryKeyValue).toHaveBeenCalledTimes(3)
    expect(mockUpdatePublishedOrganisation).toHaveBeenCalledTimes(1)
    expect(mockUpdatePublishedDelinkedCalculation).toHaveBeenCalledTimes(1)
    expect(mockUpdatePublishedD365).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('%i %s datasets published', 1, ORGANISATION)
    expect(logSpy).toHaveBeenCalledWith('%i %s datasets published', 1, DELINKED_CALCULATION)
    expect(logSpy).toHaveBeenCalledWith('%i %s datasets published', 1, D365)
    logSpy.mockRestore()
  })

  test('throws error for unknown type', async () => {
    const tablesToTarget = [{
      type: 'UNKNOWN',
      dataToPublish: [{ id: 1 }]
    }]

    await expect(sendSubset(tablesToTarget)).rejects.toThrow('Unknown type: UNKNOWN')
  })

  test('skips records that are not valid', async () => {
    mockValidateUpdate.mockReturnValueOnce(false)
    const tablesToTarget = [{
      type: ORGANISATION,
      dataToPublish: [{ id: 1 }]
    }]
    await sendSubset(tablesToTarget)
    expect(mockSendMessage).not.toHaveBeenCalled()
    expect(mockUpdatePublishedOrganisation).not.toHaveBeenCalled()
  })

  test('handles empty dataToPublish gracefully', async () => {
    const tablesToTarget = [{ type: ORGANISATION, dataToPublish: [] }]
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })
    await sendSubset(tablesToTarget)
    expect(mockRemoveDefunctValues).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith('%i %s datasets published', 0, ORGANISATION)
    logSpy.mockRestore()
  })
})
