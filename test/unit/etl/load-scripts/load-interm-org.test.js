const { storageConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermOrg } = require('../../../../app/etl/load-scripts/load-interm-org')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  },
  etlStageLog: {
    findAll: jest.fn()
  },
  Sequelize: {
    Op: {
      gt: Symbol('gt')
    }
  }
}))

describe('loadIntermOrg', () => {
  const startDate = '2023-01-01'

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Organization/export.csv', id_from: 1, id_to: 2 }, { file: 'Organization/export.csv', id_from: 3, id_to: 4 }])

    await expect(loadIntermOrg(startDate)).rejects.toThrow(
      `Multiple records found for updates to ${storageConfig.organisation.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermOrg(startDate)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Organization/export.csv', id_from: 1, id_to: 2 }])

    await loadIntermOrg(startDate)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    WITH new_data AS (
      SELECT
        O.sbi,
        A.business_address1 AS addressLine1,
        A.business_address2 AS addressLine2,
        A.business_address3 AS addressLine3,
        A.business_city AS city,
        A.business_county AS county,
        A.business_post_code AS postcode,
        A.business_email_addr AS emailaddress,
        A.frn,
        A.business_name AS name,
        O.last_updated_on::date AS updated,
        O.party_id,
        O.change_type
      FROM etl_stage_organisation O
      LEFT JOIN etl_stage_business_address_contact_v A ON A.sbi = O.sbi
      WHERE O.etl_id BETWEEN 1 AND 2
        
    ),
    updated_rows AS (
      UPDATE etl_interm_org interm
      SET
        addressLine1 = new_data.addressLine1,
        addressLine2 = new_data.addressLine2,
        addressLine3 = new_data.addressLine3,
        city = new_data.city,
        county = new_data.county,
        postcode = new_data.postcode,
        emailaddress = new_data.emailaddress,
        frn = new_data.frn,
        sbi = new_data.sbi,
        "name" = new_data.name,
        updated = new_data.updated,
        etl_inserted_dt = NOW()
      FROM new_data
      WHERE new_data.change_type = 'UPDATE'
        AND interm.party_id = new_data.party_id
      RETURNING interm.party_id
    )
    INSERT INTO etl_interm_org (
      sbi,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      county,
      postcode,
      emailaddress,
      frn,
      "name",
      party_id,
      updated
    )
    SELECT
      sbi,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      county,
      postcode,
      emailaddress,
      frn,
      "name",
      party_id,
      updated
    FROM new_data
    WHERE change_type = 'INSERT'
      OR (change_type = 'UPDATE' AND party_id NOT IN (SELECT party_id FROM updated_rows));
  `, {
      replacements: {},
      raw: true,
      transaction: undefined
    })
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Organization/export.csv', id_from: 1, id_to: 2 }])
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermOrg(startDate)).rejects.toThrow('Query failed')
  })
})
