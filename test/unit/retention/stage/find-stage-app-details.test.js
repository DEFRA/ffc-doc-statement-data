const db = require('../../../../app/data')
const { findStageAppDetails } = require('../../../../app/retention/stage/find-stage-app-details')

jest.mock('../../../../app/data', () => ({
  etlStageApplicationDetail: {
    findAll: jest.fn()
  }
}))

describe('findStageAppDetails', () => {
  const applicationId = 'APP-123'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageApplicationDetail.findAll with correct parameters', async () => {
    const mockResult = [
      { calculationId: 1 },
      { calculationId: 2 }
    ]
    db.etlStageApplicationDetail.findAll.mockResolvedValue(mockResult)

    const result = await findStageAppDetails(applicationId, transaction)

    expect(db.etlStageApplicationDetail.findAll).toHaveBeenCalledTimes(1)
    expect(db.etlStageApplicationDetail.findAll).toHaveBeenCalledWith({
      attributes: ['calculationId'],
      where: { applicationId },
      transaction
    })
    expect(result).toBe(mockResult)
  })

  test('returns empty array when no records found', async () => {
    db.etlStageApplicationDetail.findAll.mockResolvedValue([])

    const result = await findStageAppDetails(applicationId, transaction)

    expect(db.etlStageApplicationDetail.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual([])
  })

  test('propagates error when db.etlStageApplicationDetail.findAll rejects', async () => {
    const error = new Error('DB error')
    db.etlStageApplicationDetail.findAll.mockRejectedValue(error)

    await expect(findStageAppDetails(applicationId, transaction)).rejects.toThrow('DB error')
  })
})
