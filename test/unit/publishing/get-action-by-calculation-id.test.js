const db = require('../../../app/data')
const getActionsByCalculationId = require('../../../app/publishing/totals/get-actions-by-calculation-id')
const { mockAction1, mockAction2, mockAction3 } = require('../../mocks/actions')

db.action = {
  findAll: jest.fn()
}

describe('getActionsByCalculationId', () => {
  beforeEach(() => {
    db.action.findAll.mockResolvedValue([mockAction1, mockAction2, mockAction3])
  })

  test('getActionsByCalculationId returns the correct data', async () => {
    const transaction = {}
    const calculationId = 1234567
    const result = await getActionsByCalculationId(calculationId, transaction)
    expect(result).toEqual([mockAction1, mockAction2, mockAction3])
    expect(db.action.findAll).toHaveBeenCalledWith({
      where: { calculationId },
      attributes: ['actionId', 'calculationId', 'fundingCode', 'groupName', 'actionCode', 'actionName', 'rate', 'landArea', 'uom', 'annualValue', 'quarterlyValue', 'overDeclarationPenalty', 'quarterlyPaymentAmount', 'datePublished'],
      raw: true,
      transaction
    })
  })
})
