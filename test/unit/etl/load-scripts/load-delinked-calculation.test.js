const { loadDelinkedCalculation } = require('../../../../app/etl/load-scripts/load-delinked-calculation')

describe('loadDelinkedCalculation', () => {
  const startDate = '2023-01-01'
  let transaction

  beforeEach(() => {
    transaction = { raw: jest.fn() }
  })

  test('calls transaction.raw with the load SQL and startDate replacement', async () => {
    await loadDelinkedCalculation(startDate, transaction)

    expect(transaction.raw).toHaveBeenCalledWith(expect.any(String), { startDate })
  })

  test('propagates error when the raw query rejects', async () => {
    transaction.raw.mockRejectedValue(new Error('Query failed'))

    await expect(loadDelinkedCalculation(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
