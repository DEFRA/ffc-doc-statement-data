const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageTclcPiiPayClaimSfimtOption'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageTclcPiiPayClaimSfimtOption } = require('../../../../app/retention/stage/remove-etl-stage-tclc-pii-pay-claim-sfimt-option')

describe('removeEtlStageTclcPiiPayClaimSfimtOption', () => {
  const applicationId = 'APP-1010'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageTclcPiiPayClaimSfimtOption accessor with correct parameters', async () => {
    await removeEtlStageTclcPiiPayClaimSfimtOption(applicationId, transaction)

    expect(mockDb.tables.etlStageTclcPiiPayClaimSfimtOption).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('calls the etlStageTclcPiiPayClaimSfimtOption accessor without a transaction when none is provided', async () => {
    await removeEtlStageTclcPiiPayClaimSfimtOption(applicationId)

    expect(mockDb.tables.etlStageTclcPiiPayClaimSfimtOption).toHaveBeenCalledWith(undefined)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageTclcPiiPayClaimSfimtOption(applicationId, transaction)).rejects.toThrow('DB destroy error')
  })
})
