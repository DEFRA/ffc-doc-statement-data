const db = require('../../../../app/data')
const { removeEtlIntermOrg } = require('../../../../app/retention/interm/remove-etl-interm-org')

jest.mock('../../../../app/data', () => ({
  Sequelize: {
    Op: {
      in: 'in'
    }
  },
  etlIntermOrg: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermOrg', () => {
  const sbis = ['SBI-001', 'SBI-002', 'SBI-003']
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermOrg.destroy with correct parameters', async () => {
    db.etlIntermOrg.destroy.mockResolvedValue(3)

    await removeEtlIntermOrg(sbis, transaction)

    expect(db.etlIntermOrg.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermOrg.destroy).toHaveBeenCalledWith({
      where: {
        sbi: {
          [db.Sequelize.Op.in]: sbis
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlIntermOrg.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermOrg.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermOrg(sbis, transaction)).rejects.toThrow('DB error')
  })
})
