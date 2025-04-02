const db = require('../../../../app/data')
const { loadIntermTotal } = require('../../../../app/etl/load-scripts/load-interm-total')

jest.mock('../../../../app/data')

describe('loadIntermTotal', () => {
  let mockTransaction

  beforeEach(() => {
    mockTransaction = {} // Mock transaction object
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct parameters', async () => {
    const startDate = new Date('2023-01-01')

    await loadIntermTotal(startDate, mockTransaction)
    expect(db.sequelize.query).toMatchSnapshot()
  })
})
