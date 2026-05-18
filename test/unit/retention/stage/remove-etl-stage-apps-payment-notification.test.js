const db = require('../../../../app/data')
const { removeEtlStageAppsPaymentNotification } = require('../../../../app/retention/stage/remove-etl-stage-apps-payment-notification')

jest.mock('../../../../app/data', () => ({
  etlStageAppsPaymentNotification: {
    destroy: jest.fn()
  }
}))

describe('removeEtlStageAppsPaymentNotification', () => {
  const applicationId = 'APP-890'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageAppsPaymentNotification.destroy with correct parameters', async () => {
    db.etlStageAppsPaymentNotification.destroy.mockResolvedValue()

    await removeEtlStageAppsPaymentNotification(applicationId, transaction)

    expect(db.etlStageAppsPaymentNotification.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageAppsPaymentNotification.destroy).toHaveBeenCalledWith({
      where: { applicationId },
      transaction
    })
  })

  test('propagates error when db.etlStageAppsPaymentNotification.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageAppsPaymentNotification.destroy.mockRejectedValue(error)

    await expect(removeEtlStageAppsPaymentNotification(applicationId, transaction)).rejects.toThrow('DB destroy error')
  })
})
