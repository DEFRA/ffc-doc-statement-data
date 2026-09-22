const etlIntermTables = require('../../../app/constants/etl-interm-tables')
const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock([
  'etlStageLog',
  'etlStageApplicationDetail',
  'etlStageAppsPaymentNotification',
  'etlStageAppsTypes',
  'etlStageBusinessAddressContactV',
  'etlStageCalculationDetails',
  'etlStageCssContractApplications',
  'etlStageCssContracts',
  'etlStageCssOptions',
  'etlStageDefraLinks',
  'etlStageFinanceDax',
  'etlStageOrganisation',
  'etlStageTclcPiiPayClaimSfimtOption',
  ...etlIntermTables
])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const db = require('../../../app/database')
const { deleteETLRecords } = require('../../../app/etl/delete-etl-records')

describe('deleteETLRecords', () => {
  let transaction
  const logSpy = jest.spyOn(global.console, 'log')
  const warnSpy = jest.spyOn(global.console, 'warn')
  const errorSpy = jest.spyOn(global.console, 'error')

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(undefined)
    transaction = mockDb.trx
  })

  test('should log and return if no ETL records found', async () => {
    mockDb.builder.resolves([])

    await deleteETLRecords(new Date(), transaction)

    expect(mockDb.tables.etlStageLog).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.del).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith('No ETL records to roll back')
  })

  test('should delete records from the relevant tables', async () => {
    const startDate = new Date()
    const mockEntries = [
      { file: 'Application_Detail_Delinked/file1.csv', idFrom: 1, idTo: 10 },
      { file: 'Apps_Payment_Notification_Delinked/file2.csv', idFrom: 11, idTo: 20 }
    ]

    mockDb.builder.resolves(mockEntries)

    await deleteETLRecords(startDate, transaction)

    expect(mockDb.tables.etlStageLog).toHaveBeenCalledWith(transaction)
    expect(mockDb.tables.etlStageApplicationDetail).toHaveBeenCalledWith(transaction)
    expect(mockDb.tables.etlStageAppsPaymentNotification).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereBetween).toHaveBeenCalledWith('etlId', [1, 10])
    expect(mockDb.builder.whereBetween).toHaveBeenCalledWith('etlId', [11, 20])
    expect(mockDb.builder.where).toHaveBeenCalledWith('startedAt', '>=', startDate)
    expect(logSpy).toHaveBeenCalledWith('Deleted records from etlStageApplicationDetail for IDs between 1 and 10')
    expect(logSpy).toHaveBeenCalledWith('Deleted records from etlStageAppsPaymentNotification for IDs between 11 and 20')
  })

  test('should warn if no mapped table found for folder', async () => {
    const startDate = new Date()
    const mockEntries = [
      { file: 'Unknown_folder/file1.csv', idFrom: 1, idTo: 10 }
    ]

    mockDb.builder.resolves(mockEntries)

    await deleteETLRecords(startDate, transaction)

    expect(warnSpy).toHaveBeenCalledWith('No mapped table found for folder: Unknown_folder, skipping...')
  })

  test('should delete records from all intermediate tables', async () => {
    const startDate = new Date()
    mockDb.builder.resolves([
      { file: 'Application_Detail_Delinked/file1.csv', idFrom: 1, idTo: 10 }
    ])
    await deleteETLRecords(startDate, transaction)
    for (const table of etlIntermTables) {
      expect(mockDb.tables[table]).toHaveBeenCalledWith(transaction)
      expect(logSpy).toHaveBeenCalledWith(`Deleted records from intermediate table: ${table}`)
    }
    expect(mockDb.builder.where).toHaveBeenCalledWith('etlInsertedDt', '>=', startDate)
  })

  test('should warn if an intermediate table does not exist in db', async () => {
    const startDate = new Date()
    mockDb.builder.resolves([
      { file: 'Application_Detail_Delinked/file1.csv', idFrom: 1, idTo: 10 }
    ])
    // Remove one table from db mock
    const missingTable = etlIntermTables[0]
    delete db[missingTable]
    await deleteETLRecords(startDate, transaction)
    expect(warnSpy).toHaveBeenCalledWith(
      `No mapped table found for intermediate table: ${missingTable}, skipping...`
    )
  })

  test('should call accessors without a transaction when none is provided', async () => {
    const startDate = new Date()
    const mockEntries = [
      { file: 'Application_Detail_Delinked/file1.csv', idFrom: 1, idTo: 10 }
    ]

    // Restore table removed by the previous test
    db[etlIntermTables[0]] = mockDb.tables[etlIntermTables[0]]

    mockDb.builder.resolves(mockEntries)

    await deleteETLRecords(startDate)

    expect(mockDb.tables.etlStageLog).toHaveBeenCalledWith(undefined)
    expect(mockDb.tables.etlStageApplicationDetail).toHaveBeenCalledWith(undefined)
    for (const table of etlIntermTables) {
      expect(mockDb.tables[table]).toHaveBeenCalledWith(undefined)
    }
  })

  test('should throw an error if an exception occurs', async () => {
    const startDate = new Date()
    mockDb.builder.rejects(new Error('Database error'))

    await expect(deleteETLRecords(startDate, transaction)).rejects.toThrow('Database error')
    expect(errorSpy).toHaveBeenCalledWith('Error rolling back ETL records', expect.any(Error))
  })
})
