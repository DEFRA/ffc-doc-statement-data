const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermApplicationClaim'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermApplicationClaim } = require('../../../../app/retention/interm/remove-etl-interm-application-claim')

describe('removeEtlIntermApplicationClaim', () => {
  const agreementId = 'AGR-456'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(1)
  })

  test('calls the etlIntermApplicationClaim accessor with correct parameters', async () => {
    await removeEtlIntermApplicationClaim(agreementId, transaction)

    expect(mockDb.tables.etlIntermApplicationClaim).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ agreementId })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermApplicationClaim(agreementId, transaction)).rejects.toThrow('DB error')
  })
})
