const db = require('../../../../app/data')
const { loadZeroValueD365 } = require('../../../../app/etl/load-scripts/load-zero-value-d365')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadZeroValueD365', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadZeroValueD365(startDate, transaction)

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

    await expect(loadZeroValueD365(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
