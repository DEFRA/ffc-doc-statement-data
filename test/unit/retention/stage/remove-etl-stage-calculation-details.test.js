const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageCalculationDetails'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageCalculationDetails } = require('../../../../app/retention/stage/remove-etl-stage-calculation-details')

describe('removeEtlStageCalculationDetails', () => {
  const applicationId = 'APP-999'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageCalculationDetails accessor with correct parameters', async () => {
    await removeEtlStageCalculationDetails(applicationId, transaction)

    expect(mockDb.tables.etlStageCalculationDetails).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageCalculationDetails(applicationId, transaction)).rejects.toThrow('DB destroy error')
  })
})
