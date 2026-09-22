const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['total'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const updatePublished = require('../../../../app/publishing/total/update-published')

describe('updatePublished', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('updatePublished updates the correct data', async () => {
    const transaction = mockDb.trx
    const calculationId = 1234567
    await updatePublished(calculationId, transaction)

    expect(mockDb.tables.total).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ calculationId })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ datePublished: expect.any(Date) })
  })
})
