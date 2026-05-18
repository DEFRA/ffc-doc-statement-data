const db = require('../../../../app/data')
const { removeEtlStageCssContractApplications } = require('../../../../app/retention/stage/remove-etl-stage-css-contract-applications')

jest.mock('../../../../app/data', () => ({
  etlStageCssContractApplications: {
    destroy: jest.fn()
  }
}))

describe('removeEtlStageCssContractApplications', () => {
  const applicationId = 'APP-1000'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageCssContractApplications.destroy with correct parameters', async () => {
    db.etlStageCssContractApplications.destroy.mockResolvedValue()

    await removeEtlStageCssContractApplications(applicationId, transaction)

    expect(db.etlStageCssContractApplications.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageCssContractApplications.destroy).toHaveBeenCalledWith({
      where: { applicationId },
      transaction
    })
  })

  test('propagates error when db.etlStageCssContractApplications.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageCssContractApplications.destroy.mockRejectedValue(error)

    await expect(removeEtlStageCssContractApplications(applicationId, transaction)).rejects.toThrow('DB destroy error')
  })
})
