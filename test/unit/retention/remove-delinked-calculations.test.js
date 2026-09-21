const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['delinkedCalculation'])

jest.mock('../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeDelinkedCalculations } = require('../../../app/retention/remove-delinked-calculations')

describe('removeDelinkedCalculations', () => {
  const calculationIds = [201, 202, 203]
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the delinkedCalculation accessor with correct parameters', async () => {
    await removeDelinkedCalculations(calculationIds, transaction)

    expect(mockDb.tables.delinkedCalculation).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('calculationId', calculationIds)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeDelinkedCalculations(calculationIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
