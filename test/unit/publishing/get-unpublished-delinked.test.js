const getUnpublished = require('../../../app/publishing/delinkedCalculation/get-unpublished')
const getUnpublishedDelinked = require('../../../app/publishing/delinkedCalculation/get-unpublished-delinked')
const updatePublished = require('../../../app/publishing/delinkedCalculation/update-published')
const { mockDelinkedCalculation1, mockDelinkedCalculation2, mockDelinkedCalculation3 } = require('../../mocks/delinkedCalculation')

jest.mock('../../../app/publishing/delinkedCalculation/get-unpublished-delinked')
jest.mock('../../../app/publishing/delinkedCalculation/update-published')

describe('getUnpublished', () => {
  beforeEach(() => {
    getUnpublishedDelinked.mockResolvedValue([mockDelinkedCalculation1, mockDelinkedCalculation2, mockDelinkedCalculation3])
    updatePublished.mockResolvedValue()
  })

  test('returns the correct unpublished data and updates them', async () => {
    const transaction = {}
    const result = await getUnpublished(transaction)

    expect(result).toEqual([
      { ...mockDelinkedCalculation1, calculationId: mockDelinkedCalculation1.calculationReference },
      { ...mockDelinkedCalculation2, calculationId: mockDelinkedCalculation2.calculationReference },
      { ...mockDelinkedCalculation3, calculationId: mockDelinkedCalculation3.calculationReference }
    ])

    expect(updatePublished).toHaveBeenCalledTimes(3)
    expect(updatePublished).toHaveBeenCalledWith(mockDelinkedCalculation1.calculationReference, transaction)
    expect(updatePublished).toHaveBeenCalledWith(mockDelinkedCalculation2.calculationReference, transaction)
    expect(updatePublished).toHaveBeenCalledWith(mockDelinkedCalculation3.calculationReference, transaction)
  })

  test('logs an error for items missing calculationReference', async () => {
    const transaction = {}
    const mockItemMissingReference = { ...mockDelinkedCalculation1, calculationReference: undefined }
    getUnpublishedDelinked.mockResolvedValue([mockItemMissingReference, mockDelinkedCalculation2, mockDelinkedCalculation3])

    console.error = jest.fn()

    const result = await getUnpublished(transaction)

    expect(result).toEqual([
      { ...mockDelinkedCalculation2, calculationId: mockDelinkedCalculation2.calculationReference },
      { ...mockDelinkedCalculation3, calculationId: mockDelinkedCalculation3.calculationReference }
    ])

    expect(console.error).toHaveBeenCalledWith('Missing calculationReference for item:', mockItemMissingReference)
    expect(updatePublished).toHaveBeenCalledWith(mockDelinkedCalculation2.calculationReference, transaction)
    expect(updatePublished).toHaveBeenCalledWith(mockDelinkedCalculation3.calculationReference, transaction)
  })
})
