const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageOrganisation'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageOrganisation } = require('../../../../app/retention/stage/remove-etl-stage-organisation')

describe('removeEtlStageOrganisation', () => {
  const sbis = [5001, 5002, 5003]
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageOrganisation accessor with correct parameters', async () => {
    await removeEtlStageOrganisation(sbis, transaction)

    expect(mockDb.tables.etlStageOrganisation).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('sbi', sbis)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageOrganisation(sbis, transaction)).rejects.toThrow('DB destroy error')
  })
})
