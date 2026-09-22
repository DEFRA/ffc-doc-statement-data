const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermCalcOrg'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermCalcOrg } = require('../../../../app/retention/interm/remove-etl-interm-calc-org')

describe('removeEtlIntermCalcOrg', () => {
  const applicationId = 'APP-123'
  const frn = 456789
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(1)
  })

  test('calls the etlIntermCalcOrg accessor with correct parameters', async () => {
    await removeEtlIntermCalcOrg(applicationId, frn, transaction)

    expect(mockDb.tables.etlIntermCalcOrg).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId, frn })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermCalcOrg(applicationId, frn, transaction)).rejects.toThrow('DB error')
  })
})
