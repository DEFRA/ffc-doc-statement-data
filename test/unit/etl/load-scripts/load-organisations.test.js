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
    const expected = `
    INSERT INTO organisations (
      sbi, "addressLine1", "addressLine2",
      "addressLine3", city, county,
      postcode, "emailAddress", frn,
      "name", updated
    )
    SELECT
      sbi, addressLine1, addressLine2,
      addressLine3, city, county,
      SUBSTRING(postcode,1,7), emailAddress, frn::integer,
      "name", NOW()
    FROM etl_interm_org O
    WHERE O.etl_inserted_dt > :startDate;
  `

    expect(db.sequelize.query).toHaveBeenCalledWith(expected,
      {
        replacements: { startDate },
        raw: true,
        transaction: mockTransaction
      }
    )
  })
})
