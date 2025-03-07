const { storageConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermApplicationClaim } = require('../../../../app/etl/load-scripts/load-interm-application-claim')

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

describe('loadIntermApplicationClaim', () => {
  const startDate = '2023-01-01'

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'CSS_Contract_Applications/export.csv', id_from: 1, id_to: 2 }, { file: 'CSS_Contract_Applications/export.csv', id_from: 3, id_to: 4 }])

    await expect(loadIntermApplicationClaim(startDate)).rejects.toThrow(
      `Multiple records found for updates to ${storageConfig.cssContractApplications.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermApplicationClaim(startDate)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'CSS_Contract_Applications/export.csv', id_from: 1, id_to: 2 }])

    await loadIntermApplicationClaim(startDate)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    WITH new_data AS (
      SELECT
        cc.contract_id,
        ca.application_id AS claim_id,
        ca.application_id AS agreement_id,
        cl.pkid,
        cl.change_type
      FROM etl_stage_css_contract_applications cl
      LEFT JOIN etl_stage_css_contract_applications ca ON cl.contract_id = ca.contract_id AND ca.data_source_s_code = '000001'
      LEFT JOIN etl_stage_css_contracts cc ON cl.contract_id = cc.contract_id
      WHERE cl.data_source_s_code = 'CAPCLM'
        AND cl.etl_id BETWEEN 1 AND 2
        
      GROUP BY cc.contract_id, cc.start_dt, cc.end_dt, ca.application_id, cl.change_type, cl.pkid
    ),
    updated_rows AS (
      UPDATE etl_interm_application_claim interm
      SET
        contract_id = new_data.contract_id,
        claim_id = new_data.claim_id,
        agreement_id = new_data.agreement_id,
        etl_inserted_dt = NOW()
      FROM new_data
      WHERE new_data.change_type = 'UPDATE'
        AND interm.pkid = new_data.pkid
      RETURNING interm.pkid
    )
    INSERT INTO etl_interm_application_claim (
      contract_id, claim_id, agreement_id, pkid
    )
    SELECT contract_id, claim_id, agreement_id, pkid
    FROM new_data
    WHERE change_type = 'INSERT'
      OR (change_type = 'UPDATE' AND pkid NOT IN (SELECT pkid FROM updated_rows));
  `, {
      replacements: {},
      raw: true,
      transaction: undefined
    })
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'CSS_Contract_Applications/export.csv', id_from: 1, id_to: 2 }])
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermApplicationClaim(startDate)).rejects.toThrow('Query failed')
  })
})
