const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermApplicationContract'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermApplicationContract } = require('../../../../app/retention/interm/remove-etl-interm-application-contract')

describe('removeEtlIntermApplicationContract', () => {
  const applicationId = 'APP-789'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(1)
  })

  test('calls the etlIntermApplicationContract accessor with correct parameters', async () => {
    await removeEtlIntermApplicationContract(applicationId, transaction)

    expect(mockDb.tables.etlIntermApplicationContract).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('calls the etlIntermApplicationContract accessor without a transaction when none is provided', async () => {
    await removeEtlIntermApplicationContract(applicationId)

    expect(mockDb.tables.etlIntermApplicationContract).toHaveBeenCalledWith(undefined)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermApplicationContract(applicationId, transaction)).rejects.toThrow('DB error')
  })
})
