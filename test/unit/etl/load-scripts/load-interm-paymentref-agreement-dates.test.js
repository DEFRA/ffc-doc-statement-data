const db = require('../../../../app/data')
const { loadIntermPaymentrefAgreementDates } = require('../../../../app/etl/load-scripts/load-interm-paymentref-agreement-dates')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadIntermPaymentrefAgreementDates', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadIntermPaymentrefAgreementDates(startDate, transaction)

    expect(db.sequelize.query).toMatchSnapshot()
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermPaymentrefAgreementDates(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
