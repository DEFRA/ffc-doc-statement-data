const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageApplicationDetail'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { findStageAppDetails } = require('../../../../app/retention/stage/find-stage-app-details')

describe('findStageAppDetails', () => {
  const applicationId = 'APP-123'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls the etlStageApplicationDetail accessor with correct parameters', async () => {
    const mockResult = [
      { subjectId: 1 },
      { subjectId: 2 }
    ]
    mockDb.builder.resolves(mockResult)

    const result = await findStageAppDetails(applicationId, transaction)

    expect(mockDb.tables.etlStageApplicationDetail).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId })
    expect(mockDb.builder.select).toHaveBeenCalledWith('subjectId')
    expect(result).toBe(mockResult)
  })

  test('returns empty array when no records found', async () => {
    mockDb.builder.resolves([])

    const result = await findStageAppDetails(applicationId, transaction)

    expect(result).toEqual([])
  })

  test('propagates error when the query rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(findStageAppDetails(applicationId, transaction)).rejects.toThrow('DB error')
  })
})
