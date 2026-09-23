const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['dax'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getUnpublishedDax = require('../../../../app/publishing/dax/get-unpublished')
const { mockDax1, mockDax2, mockDax3 } = require('../../../mocks/dax')

describe('send dax updates', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves([mockDax1, mockDax2, mockDax3])
  })

  test('getUnpublishedDax returns the correct data', async () => {
    const transaction = mockDb.trx
    const result = await getUnpublishedDax(transaction)

    expect(result).toEqual([mockDax1, mockDax2, mockDax3])
    expect(mockDb.tables.dax).toHaveBeenCalledWith(transaction)
  })
})
