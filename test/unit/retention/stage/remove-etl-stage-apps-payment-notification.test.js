const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageAppsPaymentNotification'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageAppsPaymentNotification } = require('../../../../app/retention/stage/remove-etl-stage-apps-payment-notification')

describe('removeEtlStageAppsPaymentNotification', () => {
  const applicationId = 'APP-890'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageAppsPaymentNotification accessor with correct parameters', async () => {
    await removeEtlStageAppsPaymentNotification(applicationId, transaction)

    expect(mockDb.tables.etlStageAppsPaymentNotification).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageAppsPaymentNotification(applicationId, transaction)).rejects.toThrow('DB destroy error')
  })
})
