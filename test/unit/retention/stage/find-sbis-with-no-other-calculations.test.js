const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['delinkedCalculation'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { findSbisWithNoOtherCalculations } = require('../../../../app/retention/stage/find-sbis-with-no-other-calculations')

describe('findSbisWithNoOtherCalculations', () => {
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns empty array if sbis is null', async () => {
    const result = await findSbisWithNoOtherCalculations(null, [1, 2], transaction)
    expect(result).toEqual([])
    expect(mockDb.tables.delinkedCalculation).not.toHaveBeenCalled()
  })

  test('returns empty array if sbis is empty array', async () => {
    const result = await findSbisWithNoOtherCalculations([], [1, 2], transaction)
    expect(result).toEqual([])
    expect(mockDb.tables.delinkedCalculation).not.toHaveBeenCalled()
  })

  test('calls findAll with correct where clause using whereNotIn when excludeCalculationIds present', async () => {
    const sbis = [111, 222, 333]
    const excludeCalculationIds = [10, 20]
    const mockDbResult = [
      { sbi: 111 },
      { sbi: 333 }
    ]
    mockDb.builder.resolves(mockDbResult)

    const result = await findSbisWithNoOtherCalculations(sbis, excludeCalculationIds, transaction)

    expect(mockDb.tables.delinkedCalculation).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('sbi', sbis)
    expect(mockDb.builder.whereNotIn).toHaveBeenCalledWith('calculationId', excludeCalculationIds)
    expect(mockDb.builder.whereNotNull).not.toHaveBeenCalled()
    expect(mockDb.builder.select).toHaveBeenCalledWith('sbi')

    expect(result).toEqual([222])
  })

  test('calls findAll with correct where clause using whereNotNull when excludeCalculationIds empty', async () => {
    const sbis = [444, 555]
    const excludeCalculationIds = []
    const mockDbResult = [
      { sbi: 555 }
    ]
    mockDb.builder.resolves(mockDbResult)

    const result = await findSbisWithNoOtherCalculations(sbis, excludeCalculationIds, transaction)

    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('sbi', sbis)
    expect(mockDb.builder.whereNotNull).toHaveBeenCalledWith('calculationId')

    expect(result).toEqual([444])
  })

  test('returns all sbis if findAll returns empty array', async () => {
    const sbis = [777, 888]
    const excludeCalculationIds = [5]
    mockDb.builder.resolves([])

    const result = await findSbisWithNoOtherCalculations(sbis, excludeCalculationIds, transaction)

    expect(result).toEqual(sbis)
  })

  test('propagates error when the query rejects', async () => {
    const sbis = [1, 2]
    const excludeCalculationIds = []
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(findSbisWithNoOtherCalculations(sbis, excludeCalculationIds, transaction)).rejects.toThrow('DB error')
  })
})
