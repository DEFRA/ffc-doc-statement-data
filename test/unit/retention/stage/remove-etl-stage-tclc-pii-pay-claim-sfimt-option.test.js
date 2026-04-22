const db = require('../../../../app/data')
const { removeEtlStageTclcPiiPayClaimSfimtOption } = require('../../../../app/retention/stage/remove-etl-stage-tclc-pii-pay-claim-sfimt-option')

jest.mock('../../../../app/data', () => ({
  etlStageTclcPiiPayClaimSfimtOption: {
    destroy: jest.fn()
  }
}))

describe('removeEtlStageTclcPiiPayClaimSfimtOption', () => {
  const applicationId = 'APP-1010'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageTclcPiiPayClaimSfimtOption.destroy with correct parameters', async () => {
    db.etlStageTclcPiiPayClaimSfimtOption.destroy.mockResolvedValue()

    await removeEtlStageTclcPiiPayClaimSfimtOption(applicationId, transaction)

    expect(db.etlStageTclcPiiPayClaimSfimtOption.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageTclcPiiPayClaimSfimtOption.destroy).toHaveBeenCalledWith({
      where: { applicationId },
      transaction
    })
  })

  test('propagates error when db.etlStageTclcPiiPayClaimSfimtOption.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageTclcPiiPayClaimSfimtOption.destroy.mockRejectedValue(error)

    await expect(removeEtlStageTclcPiiPayClaimSfimtOption(applicationId, transaction)).rejects.toThrow('DB destroy error')
  })
})
