const db = require('../../../../app/data')
const { removeEtlStageApplicationDetail } = require('../../../../app/retention/stage/remove-etl-stage-application-detail')

jest.mock('../../../../app/data', () => ({
  etlStageApplicationDetail: {
    destroy: jest.fn()
  }
}))

describe('removeEtlStageApplicationDetail', () => {
  const applicationId = 'APP-789'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageApplicationDetail.destroy with correct parameters', async () => {
    db.etlStageApplicationDetail.destroy.mockResolvedValue()

    await removeEtlStageApplicationDetail(applicationId, transaction)

    expect(db.etlStageApplicationDetail.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageApplicationDetail.destroy).toHaveBeenCalledWith({
      where: { applicationId },
      transaction
    })
  })

  test('propagates error when db.etlStageApplicationDetail.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageApplicationDetail.destroy.mockRejectedValue(error)

    await expect(removeEtlStageApplicationDetail(applicationId, transaction)).rejects.toThrow('DB destroy error')
  })
})
