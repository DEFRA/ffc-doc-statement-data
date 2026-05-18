const db = require('../../../../app/data')
const { removeEtlIntermApplicationClaim } = require('../../../../app/retention/interm/remove-etl-interm-application-claim')

jest.mock('../../../../app/data', () => ({
  etlIntermApplicationClaim: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermApplicationClaim', () => {
  const agreementId = 'AGR-456'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermApplicationClaim.destroy with correct parameters', async () => {
    db.etlIntermApplicationClaim.destroy.mockResolvedValue(1)

    await removeEtlIntermApplicationClaim(agreementId, transaction)

    expect(db.etlIntermApplicationClaim.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermApplicationClaim.destroy).toHaveBeenCalledWith({
      where: { agreementId },
      transaction
    })
  })

  test('propagates error when db.etlIntermApplicationClaim.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermApplicationClaim.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermApplicationClaim(agreementId, transaction)).rejects.toThrow('DB error')
  })
})
