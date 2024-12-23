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

    const expectedQuery = `
    INSERT INTO etl_interm_total (
      payment_ref, quarter, total_amount,
      transdate
    )
    SELECT payment_ref, 
      D.quarter,
      SUM(transaction_amount) * -1 as total_amount,
      transdate 
    FROM etl_interm_finance_dax D 
    WHERE D.payment_ref LIKE 'PY%' 
      AND D.etl_inserted_dt > :startDate
    GROUP BY transdate, quarter, payment_ref
    ORDER BY payment_ref;
  `

    expect(db.sequelize.query).toHaveBeenCalledWith(
      expectedQuery,
      {
        replacements: { startDate },
        raw: true,
        transaction: mockTransaction
      }
    )
  })
})
