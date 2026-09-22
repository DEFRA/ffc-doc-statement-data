const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageCssContractApplications'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { findStageCssContractApps } = require('../../../../app/retention/stage/find-stage-css-contract-apps')

describe('findStageCssContractApps', () => {
  const applicationId = 'APP-456'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls the etlStageCssContractApplications accessor with correct parameters', async () => {
    const mockResult = [
      { contractId: 10 },
      { contractId: 20 }
    ]
    mockDb.builder.resolves(mockResult)

    const result = await findStageCssContractApps(applicationId, transaction)

    expect(mockDb.tables.etlStageCssContractApplications).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId })
    expect(mockDb.builder.select).toHaveBeenCalledWith('contractId')
    expect(result).toBe(mockResult)
  })

  test('returns empty array when no records found', async () => {
    mockDb.builder.resolves([])

    const result = await findStageCssContractApps(applicationId, transaction)

    expect(result).toEqual([])
  })

  test('propagates error when the query rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(findStageCssContractApps(applicationId, transaction)).rejects.toThrow('DB error')
  })
})
