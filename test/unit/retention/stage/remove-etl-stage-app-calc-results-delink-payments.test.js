const db = require('../../../../app/data')
const { removeEtlStageAppCalcResultsDelinkPayments } = require('../../../../app/retention/stage/remove-etl-stage-app-calc-results-delink-payments')

jest.mock('../../../../app/data', () => ({
  etlStageAppCalcResultsDelinkPayment: {
    destroy: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in'
    }
  }
}))

describe('removeEtlStageAppCalcResultsDelinkPayments', () => {
  const calculationIds = [301, 302, 303]
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageAppCalcResultsDelinkPayment.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.etlStageAppCalcResultsDelinkPayment.destroy.mockResolvedValue()

    await removeEtlStageAppCalcResultsDelinkPayments(calculationIds, transaction)

    expect(db.etlStageAppCalcResultsDelinkPayment.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageAppCalcResultsDelinkPayment.destroy).toHaveBeenCalledWith({
      where: {
        calculationId: {
          [db.Sequelize.Op.in]: calculationIds
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlStageAppCalcResultsDelinkPayment.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageAppCalcResultsDelinkPayment.destroy.mockRejectedValue(error)

    await expect(removeEtlStageAppCalcResultsDelinkPayments(calculationIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
