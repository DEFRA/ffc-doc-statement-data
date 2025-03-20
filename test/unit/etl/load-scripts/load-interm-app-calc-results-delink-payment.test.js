const { storageConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermAppCalcResultsDelinkPayment } = require('../../../../app/etl/load-scripts/load-interm-app-calc-results-delink-payment')

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

describe('loadIntermAppCalcResultsDelinkPayment', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ id_from: 1, id_to: 2 }, { id_from: 3, id_to: 4 }])

    await expect(loadIntermAppCalcResultsDelinkPayment(startDate, transaction)).rejects.toThrow(
      `Multiple records found for updates to ${storageConfig.appCalculationResultsDelinkPayments.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermAppCalcResultsDelinkPayment(startDate, transaction)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ id_from: 1, id_to: 2 }])

    await loadIntermAppCalcResultsDelinkPayment(startDate, transaction)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    WITH new_data AS (
      SELECT
        DP.calculation_id,
        CD.application_id,
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BAND1' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand1",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BAND2' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand2",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BAND3' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand3",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BAND4' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand4",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BANDPRC1' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction1",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BANDPRC2' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction2",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BANDPRC3' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction3",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BANDPRC4' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction4",
        MAX(CASE WHEN DP.variable_name = 'PROG_RED_BAND_1' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions1",
        MAX(CASE WHEN DP.variable_name = 'PROG_RED_BAND_2' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions2",
        MAX(CASE WHEN DP.variable_name = 'PROG_RED_BAND_3' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions3",
        MAX(CASE WHEN DP.variable_name = 'PROG_RED_BAND_4' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions4",
        MAX(CASE WHEN DP.variable_name = 'CUR_REF_AMOUNT' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "referenceAmount",
        MAX(CASE WHEN DP.variable_name = 'TOT_PRO_RED_AMO' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "totalProgressiveReduction",
        MAX(CASE WHEN DP.variable_name = 'CUR_TOT_REF_AMO' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "totalDelinkedPayment",
        MAX(CASE WHEN DP.variable_name = 'NE_TOT_AMOUNT' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentAmountCalculated",
        O.sbi,
        CAST(BAC.frn AS INTEGER) AS frn,
        DP.change_type
      FROM "etlStageAppCalcResultsDelinkPayments" DP
      JOIN etl_stage_calculation_details CD ON DP.calculation_id = CD.calculation_id
      JOIN etl_stage_application_detail AD ON AD.application_id = CD.application_id
      JOIN etl_stage_defra_links DL ON DL.subject_id = AD.subject_id
      LEFT JOIN etl_stage_organisation O ON O.party_id = DL.defra_id
      LEFT JOIN etl_stage_business_address_contact_v BAC ON BAC.sbi = O.sbi
      WHERE DP.etl_id BETWEEN :idFrom AND :idTo
      GROUP BY DP.calculation_id, CD.application_id, O.sbi, BAC.frn, DP.change_type
    ),
    updated_rows AS (
      UPDATE "etlIntermAppCalcResultsDelinkPayments" interm
      SET
        calculation_id = new_data.calculation_id,
        application_id = new_data.application_id,
        "paymentBand1" = new_data."paymentBand1",
        "paymentBand2" = new_data."paymentBand2",
        "paymentBand3" = new_data."paymentBand3",
        "paymentBand4" = new_data."paymentBand4",
        "percentageReduction1" = new_data."percentageReduction1",
        "percentageReduction2" = new_data."percentageReduction2",
        "percentageReduction3" = new_data."percentageReduction3",
        "percentageReduction4" = new_data."percentageReduction4",
        "progressiveReductions1" = new_data."progressiveReductions1",
        "progressiveReductions2" = new_data."progressiveReductions2",
        "progressiveReductions3" = new_data."progressiveReductions3",
        "progressiveReductions4" = new_data."progressiveReductions4",
        "referenceAmount" = new_data."referenceAmount",
        "totalProgressiveReduction" = new_data."totalProgressiveReduction",
        "totalDelinkedPayment" = new_data."totalDelinkedPayment",
        "paymentAmountCalculated" = new_data."paymentAmountCalculated",
        sbi = new_data.sbi,
        frn = new_data.frn,
        etl_inserted_dt = NOW()
      FROM new_data
      WHERE new_data.change_type = 'UPDATE'
        AND interm.calculation_id = new_data.calculation_id
        AND interm.application_id = new_data.application_id
      RETURNING interm.calculation_id, interm.application_id
    )
    INSERT INTO "etlIntermAppCalcResultsDelinkPayments" (
      calculation_id,
      application_id,
      "paymentBand1",
      "paymentBand2",
      "paymentBand3",
      "paymentBand4",
      "percentageReduction1",
      "percentageReduction2",
      "percentageReduction3",
      "percentageReduction4",
      "progressiveReductions1",
      "progressiveReductions2",
      "progressiveReductions3",
      "progressiveReductions4",
      "referenceAmount",
      "totalProgressiveReduction",
      "totalDelinkedPayment",
      "paymentAmountCalculated",
      sbi,
      frn
    )
    SELECT
      calculation_id,
      application_id,
      "paymentBand1",
      "paymentBand2",
      "paymentBand3",
      "paymentBand4",
      "percentageReduction1",
      "percentageReduction2",
      "percentageReduction3",
      "percentageReduction4",
      "progressiveReductions1",
      "progressiveReductions2",
      "progressiveReductions3",
      "progressiveReductions4",
      "referenceAmount",
      "totalProgressiveReduction",
      "totalDelinkedPayment",
      "paymentAmountCalculated",
      sbi,
      frn
    FROM new_data
    WHERE change_type = 'INSERT'
      OR (change_type = 'UPDATE' AND (calculation_id, application_id) NOT IN (SELECT calculation_id, application_id FROM updated_rows));
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

    await expect(loadIntermAppCalcResultsDelinkPayment(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
