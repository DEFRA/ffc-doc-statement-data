const db = require('../../../../app/data')
const { findSbisWithNoOtherCalculations } = require('../../../../app/retention/stage/find-sbis-with-no-other-calculations')

jest.mock('../../../../app/data', () => ({
  delinkedCalculation: {
    findAll: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in',
      notIn: 'notIn',
      ne: 'ne'
    }
  }
}))

describe('findSbisWithNoOtherCalculations', () => {
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns empty array if sbis is null', async () => {
    const result = await findSbisWithNoOtherCalculations(null, [1, 2], transaction)
    expect(result).toEqual([])
    expect(db.delinkedCalculation.findAll).not.toHaveBeenCalled()
  })

  test('returns empty array if sbis is empty array', async () => {
    const result = await findSbisWithNoOtherCalculations([], [1, 2], transaction)
    expect(result).toEqual([])
    expect(db.delinkedCalculation.findAll).not.toHaveBeenCalled()
  })

  test('calls findAll with correct where clause using notIn when excludeCalculationIds present', async () => {
    const sbis = [111, 222, 333]
    const excludeCalculationIds = [10, 20]
    const mockDbResult = [
      { sbi: 111 },
      { sbi: 333 }
    ]
    db.delinkedCalculation.findAll.mockResolvedValue(mockDbResult)

    const result = await findSbisWithNoOtherCalculations(sbis, excludeCalculationIds, transaction)

    expect(db.delinkedCalculation.findAll).toHaveBeenCalledTimes(1)
    expect(db.delinkedCalculation.findAll).toHaveBeenCalledWith({
      attributes: ['sbi'],
      where: {
        sbi: { [db.Sequelize.Op.in]: sbis },
        calculationId: { [db.Sequelize.Op.notIn]: excludeCalculationIds }
      },
      transaction
    })

    expect(result).toEqual([222])
  })

  test('calls findAll with correct where clause using ne when excludeCalculationIds empty', async () => {
    const sbis = [444, 555]
    const excludeCalculationIds = []
    const mockDbResult = [
      { sbi: 555 }
    ]
    db.delinkedCalculation.findAll.mockResolvedValue(mockDbResult)

    const result = await findSbisWithNoOtherCalculations(sbis, excludeCalculationIds, transaction)

    expect(db.delinkedCalculation.findAll).toHaveBeenCalledTimes(1)
    expect(db.delinkedCalculation.findAll).toHaveBeenCalledWith({
      attributes: ['sbi'],
      where: {
        sbi: { [db.Sequelize.Op.in]: sbis },
        calculationId: { [db.Sequelize.Op.ne]: null }
      },
      transaction
    })

    expect(result).toEqual([444])
  })

  test('returns all sbis if findAll returns empty array', async () => {
    const sbis = [777, 888]
    const excludeCalculationIds = [5]
    db.delinkedCalculation.findAll.mockResolvedValue([])

    const result = await findSbisWithNoOtherCalculations(sbis, excludeCalculationIds, transaction)

    expect(result).toEqual(sbis)
  })

  test('propagates error when db.delinkedCalculation.findAll rejects', async () => {
    const sbis = [1, 2]
    const excludeCalculationIds = []
    const error = new Error('DB error')
    db.delinkedCalculation.findAll.mockRejectedValue(error)

    await expect(findSbisWithNoOtherCalculations(sbis, excludeCalculationIds, transaction)).rejects.toThrow('DB error')
  })
})
