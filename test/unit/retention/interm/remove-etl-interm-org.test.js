const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermOrg'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermOrg } = require('../../../../app/retention/interm/remove-etl-interm-org')

describe('removeEtlIntermOrg', () => {
  const sbis = ['SBI-001', 'SBI-002', 'SBI-003']
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(3)
  })

  test('calls the etlIntermOrg accessor with correct parameters', async () => {
    await removeEtlIntermOrg(sbis, transaction)

    expect(mockDb.tables.etlIntermOrg).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('sbi', sbis)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermOrg(sbis, transaction)).rejects.toThrow('DB error')
  })
})
