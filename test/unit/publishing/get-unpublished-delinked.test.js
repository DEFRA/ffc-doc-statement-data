const getUnpublished = require('../../../app/publishing/delinkedCalculation/get-unpublished')
const getUnpublishedDelinked = require('../../../app/publishing/delinkedCalculation/get-unpublished-delinked')
const updatePublished = require('../../../app/publishing/delinkedCalculation/update-published')
const { mockDelinkedCalculation1 } = require('../../mocks/delinkedCalculation')

jest.mock('../../../app/publishing/delinkedCalculation/get-unpublished-delinked')
jest.mock('../../../app/publishing/delinkedCalculation/update-published')
jest.mock('../../../app/data')

describe('getUnpublished', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    getUnpublishedDelinked.mockResolvedValue([mockDelinkedCalculation1])
    updatePublished.mockResolvedValue()
  })

  test('returns the correct unpublished data and updates them', async () => {
    const transaction = {}
    const result = await getUnpublished(transaction)

    console.log('Result:', result)

    expect(result).toEqual([
      { ...mockDelinkedCalculation1, calculationId: mockDelinkedCalculation1.calculationId }
    ])
  })

  test('logs an error for items missing calculationId', async () => {
    const transaction = {}
    const mockItemMissingReference = { ...mockDelinkedCalculation1, calculationId: undefined }
    getUnpublishedDelinked.mockResolvedValue([mockItemMissingReference])

    console.error = jest.fn()

    const result = await getUnpublished(transaction)

    console.log('Result:', result)
  })
})
