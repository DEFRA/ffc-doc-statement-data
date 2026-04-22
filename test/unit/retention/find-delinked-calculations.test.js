const db = require('../../../app/data')
const { findDelinkedCalculations } = require('../../../app/retention/find-delinked-calculations')

jest.mock('../../../app/data', () => ({
  delinkedCalculation: {
    findAll: jest.fn()
  }
}))

describe('findDelinkedCalculations', () => {
  const agreementNumber = 'AGR-123'
  const frn = 456789
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.delinkedCalculation.findAll with correct parameters', async () => {
    const mockResult = [
      { calculationId: 1, sbi: 1001 },
      { calculationId: 2, sbi: 1002 }
    ]
    db.delinkedCalculation.findAll.mockResolvedValue(mockResult)

    const result = await findDelinkedCalculations(agreementNumber, frn, transaction)

    expect(db.delinkedCalculation.findAll).toHaveBeenCalledTimes(1)
    expect(db.delinkedCalculation.findAll).toHaveBeenCalledWith({
      attributes: ['calculationId', 'sbi'],
      where: {
        agreementNumber,
        frn
      },
      transaction
    })
    expect(result).toBe(mockResult)
  })

  test('returns empty array when no calculations found', async () => {
    db.delinkedCalculation.findAll.mockResolvedValue([])

    const result = await findDelinkedCalculations(agreementNumber, frn, transaction)

    expect(db.delinkedCalculation.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual([])
  })

  test('propagates error when db.delinkedCalculation.findAll rejects', async () => {
    const error = new Error('DB error')
    db.delinkedCalculation.findAll.mockRejectedValue(error)

    await expect(findDelinkedCalculations(agreementNumber, frn, transaction)).rejects.toThrow('DB error')
  })
})
