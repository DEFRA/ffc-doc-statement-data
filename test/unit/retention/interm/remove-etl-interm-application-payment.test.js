const db = require('../../../../app/data')
const { removeEtlIntermApplicationPayment } = require('../../../../app/retention/interm/remove-etl-interm-application-payment')

jest.mock('../../../../app/data', () => ({
  etlIntermApplicationPayment: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermApplicationPayment', () => {
  const applicationId = 'APP-123'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermApplicationPayment.destroy with correct parameters', async () => {
    db.etlIntermApplicationPayment.destroy.mockResolvedValue(1)

    await removeEtlIntermApplicationPayment(applicationId, transaction)

    expect(db.etlIntermApplicationPayment.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermApplicationPayment.destroy).toHaveBeenCalledWith({
      where: { applicationId },
      transaction
    })
  })

  test('propagates error when db.etlIntermApplicationPayment.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermApplicationPayment.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermApplicationPayment(applicationId, transaction)).rejects.toThrow('DB error')
  })
})
