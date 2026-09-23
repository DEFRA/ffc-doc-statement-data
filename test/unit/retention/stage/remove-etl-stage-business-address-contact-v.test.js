const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageBusinessAddressContactV'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageBusinessAddressContactV } = require('../../../../app/retention/stage/remove-etl-stage-business-address-contact-v')

describe('removeEtlStageBusinessAddressContactV', () => {
  const sbis = [1001, 1002, 1003]
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageBusinessAddressContactV accessor with correct parameters', async () => {
    await removeEtlStageBusinessAddressContactV(sbis, transaction)

    expect(mockDb.tables.etlStageBusinessAddressContactV).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('sbi', sbis)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('calls the etlStageBusinessAddressContactV accessor without a transaction when none is provided', async () => {
    await removeEtlStageBusinessAddressContactV(sbis)

    expect(mockDb.tables.etlStageBusinessAddressContactV).toHaveBeenCalledWith(undefined)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageBusinessAddressContactV(sbis, transaction)).rejects.toThrow('DB destroy error')
  })
})
