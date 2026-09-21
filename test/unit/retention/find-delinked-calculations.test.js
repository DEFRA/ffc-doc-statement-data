const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['delinkedCalculation'])

jest.mock('../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { findDelinkedCalculations } = require('../../../app/retention/find-delinked-calculations')

describe('findDelinkedCalculations', () => {
  const applicationId = 'AGR-123'
  const frn = 456789
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls the delinkedCalculation accessor with correct parameters', async () => {
    const mockResult = [
      { calculationId: 1, sbi: 1001 },
      { calculationId: 2, sbi: 1002 }
    ]
    mockDb.builder.resolves(mockResult)

    const result = await findDelinkedCalculations(applicationId, frn, transaction)

    expect(mockDb.tables.delinkedCalculation).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId, frn })
    expect(mockDb.builder.select).toHaveBeenCalledWith('calculationId', 'sbi')
    expect(result).toBe(mockResult)
  })

  test('returns empty array when no calculations found', async () => {
    mockDb.builder.resolves([])

    const result = await findDelinkedCalculations(applicationId, frn, transaction)

    expect(result).toEqual([])
  })

  test('propagates error when the query rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(findDelinkedCalculations(applicationId, frn, transaction)).rejects.toThrow('DB error')
  })
})
