const db = require('../../../../app/data')
const { loadTotals } = require('../../../../app/etl/load-scripts/load-totals')

jest.mock('../../../../app/data')

describe('loadTotals', () => {
  let mockTransaction

  beforeEach(() => {
    mockTransaction = {} // Mock transaction object
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct parameters', async () => {
    const startDate = new Date('2023-01-01')

    await loadTotals(startDate, mockTransaction)

    expect(db.sequelize.query).toMatchSnapshot()
  })
})
