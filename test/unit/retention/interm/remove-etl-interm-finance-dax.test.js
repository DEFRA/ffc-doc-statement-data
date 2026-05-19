const db = require('../../../../app/data')
const { removeEtlIntermFinanceDax } = require('../../../../app/retention/interm/remove-etl-interm-finance-dax')

jest.mock('../../../../app/data', () => ({
  etlIntermFinanceDax: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermFinanceDax', () => {
  const claimId = 'AGR-123'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermFinanceDax.destroy with correct parameters', async () => {
    db.etlIntermFinanceDax.destroy.mockResolvedValue(1)

    await removeEtlIntermFinanceDax(claimId, transaction)

    expect(db.etlIntermFinanceDax.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermFinanceDax.destroy).toHaveBeenCalledWith({
      where: { claimId },
      transaction
    })
  })

  test('propagates error when db.etlIntermFinanceDax.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermFinanceDax.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermFinanceDax(claimId, transaction)).rejects.toThrow('DB error')
  })
})
