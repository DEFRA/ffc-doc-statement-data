const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermApplicationPayment'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermApplicationPayment } = require('../../../../app/retention/interm/remove-etl-interm-application-payment')

describe('removeEtlIntermApplicationPayment', () => {
  const applicationId = 'APP-123'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(1)
  })

  test('calls the etlIntermApplicationPayment accessor with correct parameters', async () => {
    await removeEtlIntermApplicationPayment(applicationId, transaction)

    expect(mockDb.tables.etlIntermApplicationPayment).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermApplicationPayment(applicationId, transaction)).rejects.toThrow('DB error')
  })
})
