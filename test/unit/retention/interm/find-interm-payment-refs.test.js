const db = require('../../../../app/data')
const { findIntermPaymentRefs } = require('../../../../app/retention/interm/find-interm-payment-refs')

jest.mock('../../../../app/data', () => ({
  etlIntermFinanceDax: {
    findAll: jest.fn()
  }
}))

describe('findIntermPaymentRefs', () => {
  const agreementreference = 'AGR-123'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermFinanceDax.findAll with correct parameters', async () => {
    const mockResult = [
      { paymentRef: 'PAY-001' },
      { paymentRef: 'PAY-002' }
    ]
    db.etlIntermFinanceDax.findAll.mockResolvedValue(mockResult)

    const result = await findIntermPaymentRefs(agreementreference, transaction)

    expect(db.etlIntermFinanceDax.findAll).toHaveBeenCalledTimes(1)
    expect(db.etlIntermFinanceDax.findAll).toHaveBeenCalledWith({
      attributes: ['paymentRef'],
      where: {
        agreementreference
      },
      transaction
    })
    expect(result).toBe(mockResult)
  })

  test('returns empty array when no records found', async () => {
    db.etlIntermFinanceDax.findAll.mockResolvedValue([])

    const result = await findIntermPaymentRefs(agreementreference, transaction)

    expect(db.etlIntermFinanceDax.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual([])
  })

  test('propagates error when db.etlIntermFinanceDax.findAll rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermFinanceDax.findAll.mockRejectedValue(error)

    await expect(findIntermPaymentRefs(agreementreference, transaction)).rejects.toThrow('DB error')
  })
})
