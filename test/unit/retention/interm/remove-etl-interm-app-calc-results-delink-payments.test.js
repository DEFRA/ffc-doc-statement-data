const db = require('../../../../app/data')
const { removeEtlIntermAppCalcResultsDelinkPayments } = require('../../../../app/retention/interm/remove-etl-interm-app-calc-results-delink-payments')

jest.mock('../../../../app/data', () => ({
  etlIntermAppCalcResultsDelinkPayment: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermAppCalcResultsDelinkPayments', () => {
  const applicationId = 'APP-2020'
  const frn = 987654
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermAppCalcResultsDelinkPayment.destroy with correct parameters', async () => {
    db.etlIntermAppCalcResultsDelinkPayment.destroy.mockResolvedValue(1)

    await removeEtlIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)

    expect(db.etlIntermAppCalcResultsDelinkPayment.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermAppCalcResultsDelinkPayment.destroy).toHaveBeenCalledWith({
      where: {
        applicationId,
        frn
      },
      transaction
    })
  })

  test('propagates error when db.etlIntermAppCalcResultsDelinkPayment.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermAppCalcResultsDelinkPayment.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)).rejects.toThrow('DB error')
  })
})
