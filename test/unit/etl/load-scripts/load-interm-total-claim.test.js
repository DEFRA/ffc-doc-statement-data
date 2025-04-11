const db = require('../../../../app/data')
const { loadIntermTotalClaim } = require('../../../../app/etl/load-scripts/load-interm-total-claim')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadIntermTotalClaim', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadIntermTotalClaim(startDate, transaction)

    expect(db.sequelize.query).toMatchSnapshot()
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermTotalClaim(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
