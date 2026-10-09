const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['dax'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const updateDaxDatePublished = require('../../../../app/publishing/dax/update-published')
const mockDax = { daxId: 'test', datePublished: null }

describe('updateDaxDatePublished', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves([1])
  })

  test('updateDaxDatePublished updates the correct data', async () => {
    const transaction = mockDb.trx
    await updateDaxDatePublished(mockDax.daxId, transaction)

    expect(mockDb.tables.dax).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ daxId: mockDax.daxId })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ datePublished: expect.any(Date) })
  })
})
