const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const updateD365DatePublished = require('../../../../app/publishing/d365/update-published')
const mockD365 = { paymentReference: 'test', datePublished: null }

describe('updateD365DatePublished', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves([1])
  })

  test('updateD365DatePublished updates the correct data', async () => {
    const transaction = mockDb.trx
    await updateD365DatePublished(mockD365.paymentReference, transaction)

    expect(mockDb.tables.d365).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ d365Id: mockD365.paymentReference })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ datePublished: expect.any(Date) })
  })
})
