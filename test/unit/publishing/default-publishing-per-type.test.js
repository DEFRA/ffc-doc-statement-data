const mockGetUnpublished = jest.fn()
const mockUpdatePublished = jest.fn()
const mockRemoveDefunctValues = jest.fn((r) => r)
const mockValidateUpdate = jest.fn(() => true)
const mockSendMessage = jest.fn()
const mockGetPrimaryKeyValue = jest.fn(() => 'primaryKey')

jest.mock('../../../app/publishing/remove-defunct-values', () => mockRemoveDefunctValues)
jest.mock('../../../app/publishing/validate-update', () => mockValidateUpdate)
jest.mock('../../../app/publishing/send-message', () => mockSendMessage)
jest.mock('../../../app/publishing/get-primary-key-value', () => mockGetPrimaryKeyValue)

const { D365 } = require('../../../app/constants/types')

const publishingConfig = { dataPublishingMaxBatchSizePerDataSource: 2 }
jest.mock('../../../app/config', () => ({ publishingConfig }))

describe('defaultPublishingPerType', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetModules()
  })

  function setupMocks (type, batches) {
    jest.doMock(`../../../app/publishing/${type}/get-unpublished`, () => mockGetUnpublished)
    jest.doMock(`../../../app/publishing/${type}/update-published`, () => mockUpdatePublished)
    mockGetUnpublished.mockClear()
    mockUpdatePublished.mockClear()
    mockGetUnpublished.mockImplementationOnce(() => Promise.resolve(batches[0]))
    mockGetUnpublished.mockImplementation(() => Promise.resolve([]))
  }

  test('publishes all records in batches for a generic type', async () => {
    const type = D365
    const batch1 = [{ id: 1 }, { id: 2 }]
    setupMocks(type, [batch1])

    const defaultPublishingPerType = require('../../../app/publishing/default-publishing-per-type')
    await defaultPublishingPerType(type)

    expect(mockGetUnpublished).toHaveBeenCalledTimes(2)
    expect(mockSendMessage).toHaveBeenCalledTimes(2)
    expect(mockUpdatePublished).toHaveBeenCalledTimes(2)
    expect(mockRemoveDefunctValues).toHaveBeenCalledTimes(2)
    expect(mockValidateUpdate).toHaveBeenCalledTimes(2)
    expect(mockGetPrimaryKeyValue).toHaveBeenCalledTimes(2)
  })

  test('does not publish if no outstanding records', async () => {
    const type = D365
    setupMocks(type, [[]])

    const defaultPublishingPerType = require('../../../app/publishing/default-publishing-per-type')
    await defaultPublishingPerType(type)

    expect(mockGetUnpublished).toHaveBeenCalledTimes(1)
    expect(mockSendMessage).not.toHaveBeenCalled()
    expect(mockUpdatePublished).not.toHaveBeenCalled()
  })

  test('does not skip update if validateUpdate returns false', async () => {
    const type = D365
    const batch1 = [{ id: 1 }]
    setupMocks(type, [batch1])
    mockValidateUpdate.mockReturnValueOnce(false)

    const defaultPublishingPerType = require('../../../app/publishing/default-publishing-per-type')
    await defaultPublishingPerType(type)

    expect(mockSendMessage).not.toHaveBeenCalled()
    expect(mockUpdatePublished).toHaveBeenCalledTimes(1)
  })
})
