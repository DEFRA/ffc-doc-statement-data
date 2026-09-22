const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock([])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { loadD365 } = require('../../../../app/etl/load-scripts/load-d365')

describe('loadD365', () => {
  const startDate = '2023-01-01'
  let transaction

  beforeEach(() => {
    jest.clearAllMocks()
    transaction = { raw: jest.fn() }
  })

  test('calls transaction.raw with the load SQL and startDate replacement', async () => {
    await loadD365(startDate, transaction)

    expect(transaction.raw).toHaveBeenCalledWith(expect.any(String), { startDate })
  })

  test('propagates error when the raw query rejects', async () => {
    transaction.raw.mockRejectedValue(new Error('Query failed'))

    await expect(loadD365(startDate, transaction)).rejects.toThrow('Query failed')
  })

  test('runs against the client when no transaction is given', async () => {
    await loadD365(startDate)

    expect(mockDb.knex.raw).toHaveBeenCalledWith(expect.any(String), { startDate })
  })
})
