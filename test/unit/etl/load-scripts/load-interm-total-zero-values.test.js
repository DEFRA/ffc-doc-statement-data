const db = require('../../../../app/data')
const { loadIntermTotalZeroValues, loadIntermTotalZeroValuesDelinked } = require('../../../../app/etl/load-scripts/load-interm-total-zero-values')

jest.mock('../../../../app/data')

describe('loadIntermTotalZeroValues', () => {
  let mockTransaction

  beforeEach(() => {
    mockTransaction = {} // Mock transaction object
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct parameters', async () => {
    const startDate = new Date('2023-01-01')

    await loadIntermTotalZeroValues(startDate, mockTransaction)
    expect(db.sequelize.query).toMatchSnapshot()
  })
})

describe('loadIntermTotalZeroValuesDelinked', () => {
  let mockTransaction

  beforeEach(() => {
    mockTransaction = {} // Mock transaction object
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct parameters', async () => {
    const startDate = new Date('2023-01-01')

    await loadIntermTotalZeroValuesDelinked(startDate, mockTransaction)
    expect(db.sequelize.query).toMatchSnapshot()
  })
})
