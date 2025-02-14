const db = require('../../../../app/data')
const { loadDAX } = require('../../../../app/etl/load-scripts/load-dax')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadDAX', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadDAX(startDate, transaction)

    expect(db.sequelize.query).toMatchSnapshot()
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadDAX(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
