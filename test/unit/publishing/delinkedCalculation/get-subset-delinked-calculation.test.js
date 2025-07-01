const mockFindAll = jest.fn()
const mockCol = jest.fn((col) => `col:${col}`)
const mockOp = {
  and: 'AND',
  or: 'OR',
  in: 'IN',
  lt: 'LT'
}

jest.mock('../../../../app/data', () => ({
  delinkedCalculation: { findAll: mockFindAll },
  Sequelize: { Op: mockOp },
  sequelize: { col: mockCol }
}))

const getSubsetDelinkedCalculation = require('../../../../app/publishing/delinkedCalculation/get-subset-delinked-calculation')

describe('getSubsetDelinkedCalculation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns mapped unpublished delinked calculations', async () => {
    mockFindAll.mockResolvedValue([
      {
        applicationReference: 123,
        calculationReference: 456,
        sbi: 789,
        frn: 111,
        paymentBand1: 1,
        datePublished: null,
        updated: '2024-01-01'
      }
    ])

    const result = await getSubsetDelinkedCalculation([456])
    expect(mockFindAll).toHaveBeenCalledWith(expect.objectContaining({
      lock: true,
      skipLocked: true,
      where: expect.any(Object),
      attributes: expect.arrayContaining([
        ['applicationId', 'applicationReference'],
        ['calculationId', 'calculationReference'],
        'sbi',
        'frn'
      ]),
      raw: true
    }))
    expect(result).toEqual([
      {
        applicationReference: 123,
        calculationReference: 456,
        sbi: 789,
        frn: 111,
        paymentBand1: 1,
        datePublished: null,
        updated: '2024-01-01',
        calculationId: 456,
        applicationId: 123
      }
    ])
  })

  test('logs error and skips item if calculationReference is missing', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { })
    mockFindAll.mockResolvedValue([
      {
        applicationReference: 123,
        calculationReference: null,
        sbi: 789
      }
    ])

    const result = await getSubsetDelinkedCalculation([999])
    expect(result).toEqual([])
    expect(errorSpy).toHaveBeenCalledWith(
      'Missing calculationReference for item:',
      expect.objectContaining({ calculationReference: null })
    )
    errorSpy.mockRestore()
  })

  test('returns empty array if no results', async () => {
    mockFindAll.mockResolvedValue([])
    const result = await getSubsetDelinkedCalculation([1, 2, 3])
    expect(result).toEqual([])
  })
})
