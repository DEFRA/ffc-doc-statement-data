const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['action'])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getActionsByCalculationId = require('../../../app/publishing/total/get-actions-by-calculation-id')
const { mockAction1, mockAction2, mockAction3 } = require('../../mocks/actions')

describe('getActionsByCalculationId', () => {
  const calculationId = 1234567

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the correct data when actions exist', async () => {
    mockDb.builder.resolves([mockAction1, mockAction2, mockAction3])
    const transaction = mockDb.trx

    const result = await getActionsByCalculationId(calculationId, transaction)

    expect(result).toEqual([mockAction1, mockAction2, mockAction3])
    expect(mockDb.tables.action).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ calculationId })
    expect(mockDb.builder.select).toHaveBeenCalledWith(
      'actionId',
      { actionReference: 'actionId' },
      { calculationReference: 'calculationId' },
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
    )
  })

  test('returns an empty array if no actions exist', async () => {
    mockDb.builder.resolves([])
    const transaction = mockDb.trx

    const result = await getActionsByCalculationId(calculationId, transaction)

    expect(result).toEqual([])
    expect(mockDb.builder.where).toHaveBeenCalledWith({ calculationId })
  })

  test('works without passing a transaction', async () => {
    mockDb.builder.resolves([mockAction1])
    const result = await getActionsByCalculationId(calculationId)

    expect(result).toEqual([mockAction1])
    expect(mockDb.tables.action).toHaveBeenCalledWith(undefined)
  })

  test('throws error if the query rejects', async () => {
    const error = new Error('DB failure')
    mockDb.builder.rejects(error)

    await expect(getActionsByCalculationId(calculationId)).rejects.toThrow('DB failure')
  })
})
