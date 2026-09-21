const { executeQuery } = require('../../../../app/etl/load-scripts/load-interm-utils')
const { loadIntermPaymentrefApplication } = require('../../../../app/etl/load-scripts/load-interm-paymentref-application')

jest.mock('../../../../app/etl/load-scripts/load-interm-utils', () => ({
  executeQuery: jest.fn()
}))

describe('loadIntermPaymentrefApplication', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls executeQuery with the load SQL and startDate replacement', async () => {
    await loadIntermPaymentrefApplication(startDate, transaction)

    expect(executeQuery).toHaveBeenCalledWith(expect.any(String), { startDate }, transaction)
  })

  test('propagates error when executeQuery rejects', async () => {
    executeQuery.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermPaymentrefApplication(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
