// Import the necessary modules and the function to be tested
const db = require('../../../app/data')
const getActionsByCalculationId = require('../../../app/publishing/totals_/get-actions-by-calculation-id')
const { mockAction1, mockAction2, mockAction3 } = require('../../mocks/actions')

// Mock the necessary methods and models
db.action = {
  findAll: jest.fn()
}

describe('getActionsByCalculationId', () => {
  beforeEach(() => {
    // Mock the findAll method
    db.action.findAll.mockResolvedValue([mockAction1, mockAction2, mockAction3])
  })

  test('getActionsByCalculationId returns the correct data', async () => {
    const transaction = {} // This is sufficient for your test
    const calculationId = 1234567 // Replace with an actual calculationId
    const result = await getActionsByCalculationId(calculationId, transaction)

    // Check if the result is correct
    expect(result).toEqual([mockAction1, mockAction2, mockAction3])

    // Check if the findAll method was called with the correct arguments
    expect(db.action.findAll).toHaveBeenCalledWith({
      where: { calculationId },
      attributes: ['pkId', 'calculationId', 'fundingCode', 'groupName', 'actionCode', 'actionName', 'rate', 'landArea', 'uom', 'annualValue', 'quarterlyValue', 'overDeclarationPenalty', 'quarterlyPaymentAmount', 'datePublished'],
      raw: true,
      transaction
    })
  })
})
