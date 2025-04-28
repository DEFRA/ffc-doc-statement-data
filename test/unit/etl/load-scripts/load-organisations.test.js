const db = require('../../../../app/data')
const { loadOrganisations } = require('../../../../app/etl/load-scripts/load-organisations')

jest.mock('../../../../app/data')

describe('loadOrganisations', () => {
  let mockTransaction

  beforeEach(() => {
    mockTransaction = {} // Mock transaction object
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct parameters', async () => {
    const startDate = new Date('2023-01-01')
    await loadOrganisations(startDate, mockTransaction)
    expect(db.sequelize.query).toMatchSnapshot()
  })
})
