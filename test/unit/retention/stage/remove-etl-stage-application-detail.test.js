const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageApplicationDetail'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageApplicationDetail } = require('../../../../app/retention/stage/remove-etl-stage-application-detail')

describe('removeEtlStageApplicationDetail', () => {
  const applicationId = 'APP-789'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageApplicationDetail accessor with correct parameters', async () => {
    await removeEtlStageApplicationDetail(applicationId, transaction)

    expect(mockDb.tables.etlStageApplicationDetail).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageApplicationDetail(applicationId, transaction)).rejects.toThrow('DB destroy error')
  })
})
