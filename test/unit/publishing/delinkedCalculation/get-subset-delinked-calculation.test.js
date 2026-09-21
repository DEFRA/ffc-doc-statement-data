const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['delinkedCalculation'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getSubsetDelinkedCalculation = require('../../../../app/publishing/delinkedCalculation/get-subset-delinked-calculation')

describe('getSubsetDelinkedCalculation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns mapped unpublished delinked calculations', async () => {
    mockDb.builder.resolves([
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

    expect(mockDb.tables.delinkedCalculation).toHaveBeenCalledWith()
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('calculationId', [456])
    expect(mockDb.builder.select).toHaveBeenCalledWith(
      { applicationReference: 'applicationId' },
      { calculationReference: 'calculationId' },
      'sbi',
      'frn',
      'paymentBand1',
      'paymentBand2',
      'paymentBand3',
      'paymentBand4',
      'percentageReduction1',
      'percentageReduction2',
      'percentageReduction3',
      'percentageReduction4',
      'progressiveReductions1',
      'progressiveReductions2',
      'progressiveReductions3',
      'progressiveReductions4',
      'referenceAmount',
      'totalProgressiveReduction',
      'totalDelinkedPayment',
      'paymentAmountCalculated',
      'datePublished',
      'updated'
    )
    expect(mockDb.builder.forUpdate).toHaveBeenCalled()
    expect(mockDb.builder.skipLocked).toHaveBeenCalled()

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
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockDb.builder.resolves([
      {
        applicationReference: 123,
        calculationReference: null,
        sbi: 789
      }
    ])

    const result = await getSubsetDelinkedCalculation([999])

    expect(result).toEqual([])
    expect(errorSpy).toHaveBeenCalledWith(
      'Missing calculationReference for item: sbi: 789, frn: undefined, applicationReference: 123'
    )

    errorSpy.mockRestore()
  })

  test('returns empty array if no results', async () => {
    mockDb.builder.resolves([])

    const result = await getSubsetDelinkedCalculation([1, 2, 3])
    expect(result).toEqual([])
  })
})
