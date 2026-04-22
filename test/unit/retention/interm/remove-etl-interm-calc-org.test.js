const db = require('../../../../app/data')
const { removeEtlIntermCalcOrg } = require('../../../../app/retention/interm/remove-etl-interm-calc-org')

jest.mock('../../../../app/data', () => ({
  etlIntermCalcOrg: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermCalcOrg', () => {
  const applicationId = 'APP-123'
  const frn = 456789
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermCalcOrg.destroy with correct parameters', async () => {
    db.etlIntermCalcOrg.destroy.mockResolvedValue(1)

    await removeEtlIntermCalcOrg(applicationId, frn, transaction)

    expect(db.etlIntermCalcOrg.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermCalcOrg.destroy).toHaveBeenCalledWith({
      where: {
        applicationId,
        frn
      },
      transaction
    })
  })

  test('propagates error when db.etlIntermCalcOrg.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermCalcOrg.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermCalcOrg(applicationId, frn, transaction)).rejects.toThrow('DB error')
  })
})
