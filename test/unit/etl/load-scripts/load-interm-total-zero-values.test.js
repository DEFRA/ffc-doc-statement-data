const { executeQuery } = require('../../../../app/etl/load-scripts/load-interm-utils')
const { loadIntermTotalZeroValues } = require('../../../../app/etl/load-scripts/load-interm-total-zero-values')

jest.mock('../../../../app/etl/load-scripts/load-interm-utils', () => ({
  executeQuery: jest.fn()
}))

describe('loadIntermTotalZeroValues', () => {
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls executeQuery with the load SQL and startDate replacement', async () => {
    const startDate = new Date('2023-01-01')

    await loadIntermTotalZeroValues(startDate, transaction)

    expect(executeQuery).toHaveBeenCalledWith(expect.any(String), { startDate }, transaction)
  })

  test('propagates error when executeQuery rejects', async () => {
    executeQuery.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermTotalZeroValues(new Date('2023-01-01'), transaction)).rejects.toThrow('Query failed')
  })
})
