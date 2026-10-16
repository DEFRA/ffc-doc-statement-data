const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageCssContracts'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageCssContracts } = require('../../../../app/retention/stage/remove-etl-stage-css-contracts')

describe('removeEtlStageCssContracts', () => {
  const contractIds = [401, 402, 403]
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageCssContracts accessor with correct parameters', async () => {
    await removeEtlStageCssContracts(contractIds, transaction)

    expect(mockDb.tables.etlStageCssContracts).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('contractId', contractIds)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('calls the etlStageCssContracts accessor without a transaction when none is provided', async () => {
    await removeEtlStageCssContracts(contractIds)

    expect(mockDb.tables.etlStageCssContracts).toHaveBeenCalledWith(undefined)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageCssContracts(contractIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
