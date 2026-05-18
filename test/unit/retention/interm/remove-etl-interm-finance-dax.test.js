const db = require('../../../../app/data')
const { removeEtlIntermFinanceDax } = require('../../../../app/retention/interm/remove-etl-interm-finance-dax')

jest.mock('../../../../app/data', () => ({
  etlIntermFinanceDax: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermFinanceDax', () => {
  const agreementreference = 'AGR-123'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermFinanceDax.destroy with correct parameters', async () => {
    db.etlIntermFinanceDax.destroy.mockResolvedValue(1)

    await removeEtlIntermFinanceDax(agreementreference, transaction)

    expect(db.etlIntermFinanceDax.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermFinanceDax.destroy).toHaveBeenCalledWith({
      where: { agreementreference },
      transaction
    })
  })

  test('propagates error when db.etlIntermFinanceDax.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermFinanceDax.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermFinanceDax(agreementreference, transaction)).rejects.toThrow('DB error')
  })
})
