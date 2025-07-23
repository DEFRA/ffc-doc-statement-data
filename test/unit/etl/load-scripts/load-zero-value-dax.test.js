const db = require('../../../../app/data')
const { loadZeroValueDax } = require('../../../../app/etl/load-scripts/load-zero-value-dax')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadZeroValueDax', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadZeroValueDax(startDate, transaction)

    expect(db.sequelize.query).toHaveBeenCalledTimes(1)
    expect(db.sequelize.query.mock.calls[0][0]).toMatchSnapshot()
    expect(db.sequelize.query.mock.calls[0][1]).toEqual({
      replacements: { startDate },
      raw: true,
      transaction
    })
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadZeroValueDax(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
