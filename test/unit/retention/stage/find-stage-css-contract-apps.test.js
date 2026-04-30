const db = require('../../../../app/data')
const { findStageCssContractApps } = require('../../../../app/retention/stage/find-stage-css-contract-apps')

jest.mock('../../../../app/data', () => ({
  etlStageCssContractApplications: {
    findAll: jest.fn()
  }
}))

describe('findStageCssContractApps', () => {
  const applicationId = 'APP-456'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageCssContractApplications.findAll with correct parameters', async () => {
    const mockResult = [
      { calculationId: 10 },
      { calculationId: 20 }
    ]
    db.etlStageCssContractApplications.findAll.mockResolvedValue(mockResult)

    const result = await findStageCssContractApps(applicationId, transaction)

    expect(db.etlStageCssContractApplications.findAll).toHaveBeenCalledTimes(1)
    expect(db.etlStageCssContractApplications.findAll).toHaveBeenCalledWith({
      attributes: ['calculationId'],
      where: { applicationId },
      transaction
    })
    expect(result).toBe(mockResult)
  })

  test('returns empty array when no records found', async () => {
    db.etlStageCssContractApplications.findAll.mockResolvedValue([])

    const result = await findStageCssContractApps(applicationId, transaction)

    expect(db.etlStageCssContractApplications.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual([])
  })

  test('propagates error when db.etlStageCssContractApplications.findAll rejects', async () => {
    const error = new Error('DB error')
    db.etlStageCssContractApplications.findAll.mockRejectedValue(error)

    await expect(findStageCssContractApps(applicationId, transaction)).rejects.toThrow('DB error')
  })
})
