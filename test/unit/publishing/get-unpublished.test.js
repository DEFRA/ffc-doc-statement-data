const getUnpublished = require('../../../app/publishing/total/get-unpublished')
const getUnpublishedTotal = require('../../../app/publishing/total/get-unpublished-total')
const getActionsByCalculationId = require('../../../app/publishing/total/get-actions-by-calculation-id')

const total1 = { calculationId: 1, someProp: 'A' }
const total2 = { calculationId: 2, someProp: 'B' }

const actionA1 = { actionId: 101, detail: 'foo' }
const actionA2 = { actionId: 102, detail: 'bar' }
const actionA3 = { actionId: 103, detail: 'baz' }

jest.mock('../../../app/publishing/total/get-unpublished-total', () => jest.fn())
jest.mock('../../../app/publishing/total/get-actions-by-calculation-id', () => jest.fn())

describe('getUnpublished', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('returns an empty array when no totals are found', async () => {
    getUnpublishedTotal.mockResolvedValueOnce([])
    // Note: transaction comes first!
    const result = await getUnpublished('trans', 250, 0)
    expect(result).toEqual([])
    expect(getUnpublishedTotal).toHaveBeenCalledWith('trans', 250, 0)
  })

  test('returns grouped totals with actions for a single total', async () => {
    getUnpublishedTotal.mockResolvedValueOnce([total1])
    getActionsByCalculationId.mockResolvedValueOnce([actionA1, actionA2])

    const result = await getUnpublished('trans1', 250, 0)
    expect(result).toEqual([{ ...total1, actions: [actionA1, actionA2] }])
    expect(getUnpublishedTotal).toHaveBeenCalledWith('trans1', 250, 0)
    expect(getActionsByCalculationId).toHaveBeenCalledWith(total1.calculationId, 'trans1')
  })

  test('merges actions when multiple totals with same calculationId are returned, deduplicating actions by actionId', async () => {
    getUnpublishedTotal.mockResolvedValueOnce([total1, total1])
    getActionsByCalculationId
      .mockResolvedValueOnce([actionA1, actionA2])
      .mockResolvedValueOnce([actionA2, actionA3])

    const result = await getUnpublished({}, 100, 50)
    expect(result).toEqual([
      { ...total1, actions: [actionA1, actionA2, actionA3] }
    ])
    expect(getUnpublishedTotal).toHaveBeenCalledWith({}, 100, 50)
    expect(getActionsByCalculationId).toHaveBeenCalledTimes(2)
    expect(getActionsByCalculationId).toHaveBeenNthCalledWith(1, total1.calculationId, {})
    expect(getActionsByCalculationId).toHaveBeenNthCalledWith(2, total1.calculationId, {})
  })

  test('returns grouped totals for multiple distinct totals', async () => {
    getUnpublishedTotal.mockResolvedValueOnce([total1, total2])
    getActionsByCalculationId
      .mockResolvedValueOnce([actionA1])
      .mockResolvedValueOnce([actionA2])

    const result = await getUnpublished('trans2', 200, 10)
    expect(result).toEqual([
      { ...total1, actions: [actionA1] },
      { ...total2, actions: [actionA2] }
    ])
    expect(getUnpublishedTotal).toHaveBeenCalledWith('trans2', 200, 10)
    expect(getActionsByCalculationId).toHaveBeenNthCalledWith(1, total1.calculationId, 'trans2')
    expect(getActionsByCalculationId).toHaveBeenNthCalledWith(2, total2.calculationId, 'trans2')
  })
})
