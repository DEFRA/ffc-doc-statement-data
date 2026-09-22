const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageCssContractApplications'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageCssContractApplications } = require('../../../../app/retention/stage/remove-etl-stage-css-contract-applications')

describe('removeEtlStageCssContractApplications', () => {
  const applicationId = 'APP-1000'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageCssContractApplications accessor with correct parameters', async () => {
    await removeEtlStageCssContractApplications(applicationId, transaction)

    expect(mockDb.tables.etlStageCssContractApplications).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('calls the etlStageCssContractApplications accessor without a transaction when none is provided', async () => {
    await removeEtlStageCssContractApplications(applicationId)

    expect(mockDb.tables.etlStageCssContractApplications).toHaveBeenCalledWith(undefined)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageCssContractApplications(applicationId, transaction)).rejects.toThrow('DB destroy error')
  })
})
