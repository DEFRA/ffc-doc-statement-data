const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['subsetCheck'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getSubsetCheck = require('../../../../app/publishing/subset/get-subset-check')

describe('getSubsetCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns subset checks for given scheme', async () => {
    const mockResult = { id: 1, scheme: 'A' }
    mockDb.builder.resolves(mockResult)
    const result = await getSubsetCheck('A')

    expect(mockDb.tables.subsetCheck).toHaveBeenCalledWith()
    expect(mockDb.builder.where).toHaveBeenCalledWith({ scheme: 'A' })
    expect(mockDb.builder.forUpdate).toHaveBeenCalled()
    expect(mockDb.builder.skipLocked).toHaveBeenCalled()
    expect(result).toEqual(mockResult)
  })

  test('returns null if no results', async () => {
    mockDb.builder.resolves(undefined)
    const result = await getSubsetCheck('B')
    expect(result).toBeNull()
  })
})
