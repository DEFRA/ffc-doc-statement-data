// Import the necessary modules and the function to be tested
const getUnpublished = require('../../../app/publishing/totals_/get-unpublished')
const getUnpublishedTotals = require('../../../app/publishing/totals_/get-unpublished-totals')
const getActionsByCalculationId = require('../../../app/publishing/totals_/get-actions-by-calculation-id')
const { mockTotal1, mockTotal2, mockTotal3 } = require('../../mocks/totals')
const { mockAction1, mockAction2, mockAction3 } = require('../../mocks/actions')

// Mock the necessary methods
jest.mock('../../../app/publishing/totals_/get-unpublished-totals')
jest.mock('../../../app/publishing/totals_/get-actions-by-calculation-id')

describe('getUnpublished', () => {
  beforeEach(() => {
    // Mock the getUnpublishedTotals and getActionsByCalculationId methods
    getUnpublishedTotals.mockResolvedValue([mockTotal1, mockTotal2, mockTotal3])
    getActionsByCalculationId.mockResolvedValue([mockAction1, mockAction2, mockAction3])
  })

  test('getUnpublished returns the correct data', async () => {
    const transaction = {} // This is sufficient for your test
    const result = await getUnpublished(transaction)

    // Check if the result is correct
    expect(result).toEqual([
      { ...mockTotal1, actions: [mockAction1, mockAction2, mockAction3] },
      { ...mockTotal2, actions: [mockAction1, mockAction2, mockAction3] },
      { ...mockTotal3, actions: [mockAction1, mockAction2, mockAction3] }
    ])
  })
})
