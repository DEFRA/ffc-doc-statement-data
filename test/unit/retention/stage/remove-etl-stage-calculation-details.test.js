const db = require('../../../../app/data')
const { removeEtlStageCalculationDetails } = require('../../../../app/retention/stage/remove-etl-stage-calculation-details')

jest.mock('../../../../app/data', () => ({
  etlStageCalculationDetails: {
    destroy: jest.fn()
  }
}))

describe('removeEtlStageCalculationDetails', () => {
  const applicationId = 'APP-999'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageCalculationDetails.destroy with correct parameters', async () => {
    db.etlStageCalculationDetails.destroy.mockResolvedValue()

    await removeEtlStageCalculationDetails(applicationId, transaction)

    expect(db.etlStageCalculationDetails.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageCalculationDetails.destroy).toHaveBeenCalledWith({
      where: { applicationId },
      transaction
    })
  })

  test('propagates error when db.etlStageCalculationDetails.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageCalculationDetails.destroy.mockRejectedValue(error)

    await expect(removeEtlStageCalculationDetails(applicationId, transaction)).rejects.toThrow('DB destroy error')
  })
})
