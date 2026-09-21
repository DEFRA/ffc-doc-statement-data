const { loadZeroValueD365 } = require('../../../../app/etl/load-scripts/load-zero-value-d365')

describe('loadZeroValueD365', () => {
  const startDate = '2023-01-01'
  let transaction

  beforeEach(() => {
    transaction = { raw: jest.fn() }
  })

  test('calls transaction.raw with the load SQL and startDate replacement', async () => {
    await loadZeroValueD365(startDate, transaction)

    expect(transaction.raw).toHaveBeenCalledWith(expect.any(String), { startDate })
  })

  test('propagates error when the raw query rejects', async () => {
    transaction.raw.mockRejectedValue(new Error('Query failed'))

    await expect(loadZeroValueD365(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
