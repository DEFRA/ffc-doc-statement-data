const { storageConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermFinanceDAX } = require('../../../../app/etl/load-scripts/load-interm-finance-dax')

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

describe('loadIntermFinanceDAX', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ id_from: 1, id_to: 2 }, { id_from: 3, id_to: 4 }])

    await expect(loadIntermFinanceDAX(startDate, transaction)).rejects.toThrow(
      `Multiple records found for updates to ${storageConfig.financeDAX.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermFinanceDAX(startDate, transaction)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ id_from: 1, id_to: 2 }])

    await loadIntermFinanceDAX(startDate, transaction)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    WITH new_data AS (
      SELECT
        transdate,
        invoiceid,
        scheme::integer,
        fund,
        marketingyear::integer,
        "month",
        quarter,
        CAST(
          COALESCE(
            (SELECT CAST((value - lag) / -100.00 AS DECIMAL(10,2)) AS value 
              FROM (
                SELECT
                  value,
                  COALESCE(LAG(value, 1) OVER ( ORDER BY S.settlement_date ASC),0) AS lag,
                  S.reference
                  FROM etl_stage_settlement S 
                  WHERE S.invoice_number = D.invoiceid
                  ORDER BY value
              ) B WHERE B.reference = D.settlementvoucher),
            lineamountmstgbp)
          AS DECIMAL(10,2)) AS TRANSACTION_AMOUNT,
        agreementreference,
        substring(invoiceid, 2, position('Z' in invoiceid) - (position('S' in invoiceid) + 2))::integer AS siti_invoice_id,
        substring(invoiceid, position('Z' in invoiceid) + 1, position('V' in invoiceid) - (position('Z' in invoiceid) + 1))::integer AS claim_id,
        settlementvoucher AS PAYMENT_REF,
        change_type,
        recid
      FROM etl_stage_finance_dax D
      WHERE LENGTH(accountnum) = 10
        AND etl_id BETWEEN :idFrom AND :idTo
        AND invoiceid LIKE 'S%Z%'
    ),
    updated_rows AS (
      UPDATE etl_interm_finance_dax interm
      SET
        transdate = new_data.transdate,
        scheme = new_data.scheme,
        fund = new_data.fund,
        marketingyear = new_data.marketingyear,
        "month" = new_data."month",
        quarter = new_data.quarter,
        TRANSACTION_AMOUNT = new_data.TRANSACTION_AMOUNT,
        agreementreference = new_data.agreementreference,
        siti_invoice_id = new_data.siti_invoice_id,
        claim_id = new_data.claim_id,
        invoiceid = new_data.invoiceid,
        etl_inserted_dt = NOW()
      FROM new_data
      WHERE new_data.change_type = 'UPDATE'
        AND interm.recid = new_data.recid
      RETURNING interm.recid
    )
    INSERT INTO etl_interm_finance_dax (
      transdate,
      invoiceid,
      scheme,
      fund,
      marketingyear,
      "month",
      quarter,
      TRANSACTION_AMOUNT,
      agreementreference,
      siti_invoice_id,
      claim_id,
      PAYMENT_REF,
      recid
    )
    SELECT
      transdate,
      invoiceid,
      scheme,
      fund,
      marketingyear,
      "month",
      quarter,
      TRANSACTION_AMOUNT,
      agreementreference,
      siti_invoice_id,
      claim_id,
      PAYMENT_REF,
      recid
    FROM new_data
    WHERE change_type = 'INSERT'
      OR (change_type = 'UPDATE' AND recid NOT IN (SELECT recid FROM updated_rows));
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

    await expect(loadIntermFinanceDAX(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
