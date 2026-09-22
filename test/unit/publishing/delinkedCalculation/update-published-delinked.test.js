const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['delinkedCalculation'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const updatePublished = require('../../../../app/publishing/delinkedCalculation/update-published')

describe('updatePublished', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('updatePublished updates the correct data', async () => {
    const transaction = mockDb.trx
    const calculationReference = 1234567
    await updatePublished(calculationReference, transaction)

    expect(mockDb.tables.delinkedCalculation).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ calculationId: calculationReference })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ datePublished: expect.any(Date) })
  })
})
