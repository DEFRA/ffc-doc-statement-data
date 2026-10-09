const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageDefraLinks'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageDefraLinks } = require('../../../../app/retention/stage/remove-etl-stage-defra-links')

describe('removeEtlStageDefraLinks', () => {
  const subjectIds = ['SUBJ-1', 'SUBJ-2', 'SUBJ-3']
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageDefraLinks accessor with correct parameters', async () => {
    await removeEtlStageDefraLinks(subjectIds, transaction)

    expect(mockDb.tables.etlStageDefraLinks).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('subjectId', subjectIds)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('calls the etlStageDefraLinks accessor without a transaction when none is provided', async () => {
    await removeEtlStageDefraLinks(subjectIds)

    expect(mockDb.tables.etlStageDefraLinks).toHaveBeenCalledWith(undefined)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageDefraLinks(subjectIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
