const db = require('../../../app/data')
const { deleteETLRecords } = require('../../../app/etl/delete-etl-records')

jest.mock('../../../app/data', () => ({
  etlStageLog: {
    findAll: jest.fn(),
    destroy: jest.fn()
  },
  etlStageApplicationDetail: {
    destroy: jest.fn()
  },
  etlStageAppsPaymentNotification: {
    destroy: jest.fn()
  },
  etlStageAppsTypes: {
    destroy: jest.fn()
  },
  etlStageBusinessAddressContactV: {
    destroy: jest.fn()
  },
  etlStageCalculationDetails: {
    destroy: jest.fn()
  },
  etlStageCssContractApplications: {
    destroy: jest.fn()
  },
  etlStageCssContracts: {
    destroy: jest.fn()
  },
  etlStageCssOptions: {
    destroy: jest.fn()
  },
  etlStageDefraLinks: {
    destroy: jest.fn()
  },
  etlStageFinanceDax: {
    destroy: jest.fn()
  },
  etlStageOrganisation: {
    destroy: jest.fn()
  },
  etlStageSettlement: {
    destroy: jest.fn()
  },
  etlStageTclcPiiPayClaimSfimtOption: {
    destroy: jest.fn()
  },
  etlStageTclcPiiPayClaimSfimt: {
    destroy: jest.fn()
  },
  Sequelize: {
    Op: {
      gte: Symbol('gte'),
      between: Symbol('between')
    }
  }
}))

describe('deleteETLRecords', () => {
  let transaction
  const logSpy = jest.spyOn(global.console, 'log')
  const warnSpy = jest.spyOn(global.console, 'warn')
  const errorSpy = jest.spyOn(global.console, 'error')

  beforeEach(() => {
    jest.clearAllMocks()
    transaction = {}
  })

  test('should log and return if no ETL records found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await deleteETLRecords(new Date(), transaction)

    expect(db.etlStageLog.findAll).toHaveBeenCalled()
    expect(db.etlStageLog.destroy).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith('No ETL records to roll back')
  })

  test('should delete records from the relevant tables', async () => {
    const startDate = new Date()
    const mockEntries = [
      {
        dataValues: {
          file: 'Application_Detail_SFI23/file1.csv',
          idFrom: 1,
          idTo: 10
        }
      },
      {
        dataValues: {
          file: 'Apps_Payment_Notification_SFI23/file2.csv',
          idFrom: 11,
          idTo: 20
        }
      }
    ]

    db.etlStageLog.findAll.mockResolvedValue(mockEntries)

    await deleteETLRecords(startDate, transaction)

    expect(db.etlStageLog.findAll).toHaveBeenCalled()
    expect(db.etlStageApplicationDetail.destroy).toHaveBeenCalledWith({
      where: { etlId: { [db.Sequelize.Op.between]: [1, 10] } },
      transaction
    })
    expect(db.etlStageAppsPaymentNotification.destroy).toHaveBeenCalledWith({
      where: { etlId: { [db.Sequelize.Op.between]: [11, 20] } },
      transaction
    })
    expect(db.etlStageLog.destroy).toHaveBeenCalledWith({
      where: {
        startedAt: { [db.Sequelize.Op.gte]: startDate }
      },
      transaction
    })
    expect(logSpy).toHaveBeenCalledWith('Deleted records from etlStageApplicationDetail for IDs between 1 and 10')
    expect(logSpy).toHaveBeenCalledWith('Deleted records from etlStageAppsPaymentNotification for IDs between 11 and 20')
  })

  test('should warn if no mapped table found for folder', async () => {
    const startDate = new Date()
    const mockEntries = [
      {
        dataValues: {
          file: 'Unknown_folder/file1.csv',
          idFrom: 1,
          idTo: 10
        }
      }
    ]

    db.etlStageLog.findAll.mockResolvedValue(mockEntries)

    await deleteETLRecords(startDate, transaction)

    expect(warnSpy).toHaveBeenCalledWith('No mapped table found for folder: Unknown_folder, skipping...')
  })

  test('should throw an error if an exception occurs', async () => {
    const startDate = new Date()
    db.etlStageLog.findAll.mockRejectedValue(new Error('Database error'))

    await expect(deleteETLRecords(startDate, transaction)).rejects.toThrow('Database error')
    expect(errorSpy).toHaveBeenCalledWith('Error rolling back ETL records', expect.any(Error))
  })
})
