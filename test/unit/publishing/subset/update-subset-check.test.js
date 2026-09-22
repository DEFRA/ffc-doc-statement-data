const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['subsetCheck'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { DELINKED } = require('../../../../app/constants/schemes')
const updateSubsetCheck = require('../../../../app/publishing/subset/update-subset-check')

describe('updateSubsetCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves([1])
  })

  test('updates subsetSent to true by default', async () => {
    const result = await updateSubsetCheck(DELINKED)

    expect(mockDb.builder.where).toHaveBeenCalledWith({ scheme: DELINKED })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ subsetSent: true })
    expect(result).toEqual([1])
  })

  test('updates subsetSent to false if specified', async () => {
    const result = await updateSubsetCheck(DELINKED, false)

    expect(mockDb.builder.where).toHaveBeenCalledWith({ scheme: DELINKED })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ subsetSent: false })
    expect(result).toEqual([1])
  })
})
