const db = require('../../../../app/data')
const { loadD365 } = require('../../../../app/etl/load-scripts/load-d365')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadD365', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadD365(startDate, transaction)

    expect(db.sequelize.query).toMatchSnapshot()
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadD365(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
