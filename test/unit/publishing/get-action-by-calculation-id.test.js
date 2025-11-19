const db = require('../../../app/data')
const getActionsByCalculationId = require('../../../app/publishing/total/get-actions-by-calculation-id')
const { mockAction1, mockAction2, mockAction3 } = require('../../mocks/actions')

db.action = {
  findAll: jest.fn()
}

describe('getActionsByCalculationId', () => {
  const calculationId = 1234567

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the correct data when actions exist', async () => {
    db.action.findAll.mockResolvedValue([mockAction1, mockAction2, mockAction3])
    const transaction = {}

    const result = await getActionsByCalculationId(calculationId, transaction)

    expect(result).toEqual([mockAction1, mockAction2, mockAction3])
    expect(db.action.findAll).toHaveBeenCalledWith({
      where: { calculationId },
      attributes: [
        'actionId',
        ['actionId', 'actionReference'],
        ['calculationId', 'calculationReference'],
        'fundingCode',
        'groupName',
        'actionCode',
        'actionName',
        'rate',
        'landArea',
        'uom',
        'annualValue',
        'quarterlyValue',
        'overDeclarationPenalty',
        'quarterlyPaymentAmount',
        'datePublished'
      ],
      raw: true,
      transaction
    })
  })

  test('returns an empty array if no actions exist', async () => {
    db.action.findAll.mockResolvedValue([])
    const transaction = {}

    const result = await getActionsByCalculationId(calculationId, transaction)

    expect(result).toEqual([])
    expect(db.action.findAll).toHaveBeenCalledWith(expect.objectContaining({
      where: { calculationId }
    }))
  })

  test('works without passing a transaction', async () => {
    db.action.findAll.mockResolvedValue([mockAction1])
    const result = await getActionsByCalculationId(calculationId)

    expect(result).toEqual([mockAction1])
    expect(db.action.findAll).toHaveBeenCalledWith(expect.objectContaining({
      where: { calculationId },
      transaction: undefined
    }))
  })

  test('throws error if db.action.findAll rejects', async () => {
    const error = new Error('DB failure')
    db.action.findAll.mockRejectedValue(error)

    await expect(getActionsByCalculationId(calculationId)).rejects.toThrow('DB failure')
  })
})
