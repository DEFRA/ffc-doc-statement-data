const { storageConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermCalcOrg } = require('../../../../app/etl/load-scripts/load-interm-calc-org')

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

describe('loadIntermCalcOrg', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ id_from: 1, id_to: 2 }, { id_from: 3, id_to: 4 }])

    await expect(loadIntermCalcOrg(startDate, transaction)).rejects.toThrow(
      `Multiple records found for updates to ${storageConfig.appsPaymentNotification.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermCalcOrg(startDate, transaction)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ id_from: 1, id_to: 2 }])

    await loadIntermCalcOrg(startDate, transaction)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    WITH new_data AS (
      SELECT
        CD.calculation_id,
        BAC.sbi,
        BAC.frn,
        CD.application_id,
        CD.calculation_dt,
        CD.id_clc_header,
        APN.change_type
      FROM etl_stage_apps_payment_notification APN
      INNER JOIN etl_stage_css_contract_applications CLAIM 
        ON CLAIM.application_id = APN.application_id 
        AND CLAIM.data_source_s_code = 'CAPCLM'
      INNER JOIN etl_stage_css_contract_applications APP 
        ON APP.contract_id = CLAIM.contract_id 
        AND APP.data_source_s_code = '000001'
      INNER JOIN etl_interm_finance_dax D 
        ON D.claim_id = CLAIM.application_id
      INNER JOIN etl_stage_finance_dax SD 
        ON SD.invoiceid = D.invoiceid
      INNER JOIN etl_stage_business_address_contact_v BAC 
        ON BAC.frn = SD.custvendac
      INNER JOIN etl_stage_calculation_details CD 
        ON CD.application_id = APN.application_id 
        AND CD.id_clc_header = APN.id_clc_header
        AND CD.ranked = 1
      WHERE APN.notification_flag = 'P'
        AND APN.etl_id BETWEEN :idFrom AND :idTo
      GROUP BY CD.calculation_id, BAC.sbi, BAC.frn, CD.application_id, CD.calculation_dt, CD.id_clc_header, APN.change_type
    ),
    updated_rows AS (
      UPDATE etl_interm_calc_org interm
      SET
        sbi = new_data.sbi,
        frn = new_data.frn,
        calculation_date = new_data.calculation_dt,
        etl_inserted_dt = NOW()
      FROM new_data
      WHERE new_data.change_type = 'UPDATE'
        AND interm.calculation_id = new_data.calculation_id
        AND interm.id_clc_header = new_data.id_clc_header
      RETURNING interm.calculation_id, interm.id_clc_header
    )
    INSERT INTO etl_interm_calc_org (
      calculation_id,
      sbi,
      frn,
      application_id,
      calculation_date,
      id_clc_header
    )
    SELECT
      calculation_id,
      sbi,
      frn,
      application_id,
      calculation_dt,
      id_clc_header
    FROM new_data
    WHERE change_type = 'INSERT'
      OR (change_type = 'UPDATE' AND (calculation_id, id_clc_header) NOT IN (SELECT calculation_id, id_clc_header FROM updated_rows));
  `, {
      replacements: {
        idFrom: 1,
        idTo: 2
      },
      raw: true,
      transaction
    })
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ id_from: 1, id_to: 2 }])
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermCalcOrg(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
