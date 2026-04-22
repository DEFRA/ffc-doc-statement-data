const db = require('../../../../app/data')
const { removeEtlIntermApplicationContract } = require('../../../../app/retention/interm/remove-etl-interm-application-contract')

jest.mock('../../../../app/data', () => ({
  etlIntermApplicationContract: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermApplicationContract', () => {
  const applicationId = 'APP-789'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermApplicationContract.destroy with correct parameters', async () => {
    db.etlIntermApplicationContract.destroy.mockResolvedValue(1)

    await removeEtlIntermApplicationContract(applicationId, transaction)

    expect(db.etlIntermApplicationContract.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermApplicationContract.destroy).toHaveBeenCalledWith({
      where: { applicationId },
      transaction
    })
  })

  test('propagates error when db.etlIntermApplicationContract.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermApplicationContract.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermApplicationContract(applicationId, transaction)).rejects.toThrow('DB error')
  })
})
