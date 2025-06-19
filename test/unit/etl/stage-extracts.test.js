const { writeToString } = require('@fast-csv/format')
const storage = require('../../../app/storage')
const { stageApplicationDetails, stageAppsTypes, stageAppsPaymentNotifications, stageBusinessAddressContacts, stageCalculationDetails, stageCSSContractApplications, stageCSSContract, stageCSSOptions, stageDefraLinks, stageFinanceDAX, stageOrganisation, stageTCLCOption, stageApplicationDetailsDelinked, stageAppsTypesDelinked } = require('../../../app/etl/staging')
const { loadETLData } = require('../../../app/etl/load-etl-data')
const { etlConfig } = require('../../../app/config')
const ora = require('ora')
const { stageExtracts } = require('../../../app/etl/stage-extracts')

jest.mock('@fast-csv/format')
jest.mock('../../../app/storage')
jest.mock('../../../app/etl/staging')
jest.mock('../../../app/etl/load-etl-data')
jest.mock('../../../app/config')
jest.mock('ora')
jest.mock('../../../app/config', () => {
  const originalModule = jest.requireActual('../../../app/config')
  return {
    ...originalModule,
    etlConfig: {
      ...originalModule.etlConfig,
      sfi23Enabled: true
    }
  }
})

jest.mock('../../../app/messaging/create-alerts', () => ({
  createAlerts: jest.fn()
}))
const { createAlerts } = require('../../../app/messaging/create-alerts')

const stageFunctions = [
  { fn: stageApplicationDetails, label: etlConfig.applicationDetail.folder },
  { fn: stageAppsTypes, label: etlConfig.appsTypes.folder },
  { fn: stageAppsPaymentNotifications, label: etlConfig.appsPaymentNotification.folder },
  { fn: stageBusinessAddressContacts, label: etlConfig.businessAddress.folder },
  { fn: stageCalculationDetails, label: etlConfig.calculationsDetails.folder },
  { fn: stageCSSContractApplications, label: etlConfig.cssContractApplications.folder },
  { fn: stageCSSContract, label: etlConfig.cssContract.folder },
  { fn: stageCSSOptions, label: etlConfig.cssOptions.folder },
  { fn: stageDefraLinks, label: etlConfig.defraLinks.folder },
  { fn: stageFinanceDAX, label: etlConfig.financeDAX.folder },
  { fn: stageOrganisation, label: etlConfig.organisation.folder },
  { fn: stageTCLCOption, label: etlConfig.tclcOption.folder }
]

describe('ETL Process', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call writeToString with global results', async () => {
    global.results = [{ id: 1, name: 'test' }]
    const mockSpinner = {
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
    }
    ora.mockReturnValue(mockSpinner)
    stageApplicationDetails.mockResolvedValue()
    writeToString.mockResolvedValue('csv content')
    storage.getBlob.mockResolvedValue({
      upload: jest.fn().mockResolvedValue()
    })
    storage.getFileList.mockResolvedValue(['Application_Detail_SFI23/file1'])
    loadETLData.mockResolvedValue()

    await stageExtracts()

    expect(writeToString).toHaveBeenCalledWith(global.results)
  })

  test('should upload the CSV content to the correct blob', async () => {
    global.results = [{ id: 1, name: 'test' }]
    const mockSpinner = {
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
    }
    ora.mockReturnValue(mockSpinner)
    stageApplicationDetails.mockResolvedValue()
    writeToString.mockResolvedValue('csv content')
    const uploadMock = jest.fn().mockResolvedValue()
    storage.getBlob.mockResolvedValue({
      upload: uploadMock
    })
    storage.getFileList.mockResolvedValue(['Application_Detail_SFI23/file1'])
    loadETLData.mockResolvedValue()

    await stageExtracts()

    expect(uploadMock).toHaveBeenCalledWith('csv content', 'csv content'.length)
  })

  test('should call loadETLData with the start date', async () => {
    global.results = [{ id: 1, name: 'test' }]
    const mockSpinner = {
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
    }
    ora.mockReturnValue(mockSpinner)
    stageApplicationDetails.mockResolvedValue()
    writeToString.mockResolvedValue('csv content')
    storage.getBlob.mockResolvedValue({
      upload: jest.fn().mockResolvedValue()
    })
    storage.getFileList.mockResolvedValue(['Application_Detail_SFI23/file1'])
    loadETLData.mockResolvedValue()

    const mockDate = new Date()
    await stageExtracts()

    expect(loadETLData).toHaveBeenCalledWith(mockDate)
  })

  test('should handle no DWH files identified for processing', async () => {
    storage.getFileList.mockResolvedValue([])

    const consoleInfoMock = jest.spyOn(console, 'info').mockImplementation(() => {})

    await stageExtracts()

    expect(consoleInfoMock).toHaveBeenCalledWith('No DWH files identified for processing')
    consoleInfoMock.mockRestore()
  })

  test.only('should handle ora spinner for each stage function', async () => {
    const mockSpinner = {
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
    }
    ora.mockReturnValue(mockSpinner)

    storage.getFileList.mockResolvedValue([
      'Application_Detail_SFI23/file1',
      'Apps_Types_SFI23/file2',
      'Apps_Payment_Notification_SFI23/file3',
      'Business_address_contact_v_SFI23/file4',
      'Calculations_Details_MV_SFI23/file5',
      'CSS_Contract_Applications_SFI23/file6',
      'CSS_Contract_SFI23/file7',
      'CSS_Options_SFI23/file8',
      'Defra_Links_SFI23/file9',
      'Finance_Dax_SFI23/file10',
      'Organization_SFI23/file11',
      'capd_dwh_ods.tclc_pii_pay_claim_sfimt_option_SFI23/file12'
    ])
    stageApplicationDetails.mockResolvedValue()
    stageAppsTypes.mockResolvedValue()
    stageAppsPaymentNotifications.mockResolvedValue()
    stageBusinessAddressContacts.mockResolvedValue()
    stageCalculationDetails.mockResolvedValue()
    stageCSSContractApplications.mockResolvedValue()
    stageCSSContract.mockResolvedValue()
    stageCSSOptions.mockResolvedValue()
    stageDefraLinks.mockResolvedValue()
    stageFinanceDAX.mockResolvedValue()
    stageOrganisation.mockResolvedValue()
    stageTCLCOption.mockResolvedValue()

    storage.getBlob.mockResolvedValue({
      upload: jest.fn().mockResolvedValue()
    })

    writeToString.mockResolvedValue('csv content')

    await stageExtracts()

    expect(ora).toHaveBeenCalledTimes(stageFunctions.length)
    expect(mockSpinner.start).toHaveBeenCalledTimes(stageFunctions.length)
  })

  test('should handle ora spinner failure', async () => {
    const mockSpinner = {
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
    }
    ora.mockReturnValue(mockSpinner)

    storage.getFileList.mockResolvedValue(['Application_Detail_SFI23/file1'])
    stageApplicationDetails.mockRejectedValue(new Error('Test error'))

    await stageExtracts()

    expect(mockSpinner.fail).toHaveBeenCalledWith(`${etlConfig.applicationDetail.folder} - Test error`)
  })

  test('should call only sfi23 stage functions when sfi23Enabled is true and delinkedEnabled is false', async () => {
    etlConfig.sfi23Enabled = true
    etlConfig.delinkedEnabled = false

    storage.getFileList.mockResolvedValue(['Application_Detail_SFI23/file1'])

    stageApplicationDetails.mockResolvedValue()
    stageAppsTypes.mockResolvedValue()
    stageAppsPaymentNotifications.mockResolvedValue()
    stageBusinessAddressContacts.mockResolvedValue()

    await stageExtracts()

    expect(stageApplicationDetails).toHaveBeenCalled()
    expect(stageAppsTypes).toHaveBeenCalled()
    expect(stageAppsPaymentNotifications).toHaveBeenCalled()
    expect(stageBusinessAddressContacts).toHaveBeenCalled()
    expect(stageApplicationDetailsDelinked).not.toHaveBeenCalled()
  })

  test('should call sfi23 and delinked stage functions when delinkedEnabled is true', async () => {
    etlConfig.sfi23Enabled = true
    etlConfig.delinkedEnabled = true

    storage.getFileList.mockResolvedValue([
      'Application_Detail_SFI23/file1',
      'Apps_Types_Delinked/file2'
    ])

    stageApplicationDetails.mockResolvedValue()
    stageAppsTypesDelinked.mockResolvedValue()

    await stageExtracts()

    expect(stageApplicationDetails).toHaveBeenCalled()
    expect(stageAppsTypesDelinked).toHaveBeenCalled()
  })

  test('should not call any stage functions when no ETL files are identified', async () => {
    storage.getFileList.mockResolvedValue([])

    await stageExtracts()

    expect(stageApplicationDetails).not.toHaveBeenCalled()
    expect(stageAppsTypes).not.toHaveBeenCalled()
  })

  test('should call the correct functions for their respective folders', async () => {
    etlConfig.sfi23Enabled = true
    storage.getFileList.mockResolvedValue([
      'Application_Detail_SFI23/file1',
      'Apps_Types_SFI23/file2',
      'Apps_Payment_Notification_SFI23/file3'
    ])

    stageApplicationDetails.mockResolvedValue()
    stageAppsTypes.mockResolvedValue()
    stageAppsPaymentNotifications.mockResolvedValue()

    await stageExtracts()

    expect(stageApplicationDetails).toHaveBeenCalled()
    expect(stageAppsTypes).toHaveBeenCalled()
    expect(stageAppsPaymentNotifications).toHaveBeenCalled()
  })

  test('should call createAlerts when staging operations fail', async () => {
    const mockSpinner = {
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
    }
    ora.mockReturnValue(mockSpinner)

    storage.getFileList.mockResolvedValue([
      'Application_Detail_SFI23/file1',
      'Apps_Types_SFI23/file2'
    ])

    stageApplicationDetails.mockRejectedValue(new Error('First error'))
    stageAppsTypes.mockRejectedValue(new Error('Second error'))

    await stageExtracts()

    expect(createAlerts).toHaveBeenCalledWith([
      {
        file: etlConfig.applicationDetail.folder,
        message: 'First error'
      },
      {
        file: etlConfig.appsTypes.folder,
        message: 'Second error'
      }
    ])
  })

  test('should not call createAlerts when all staging operations succeed', async () => {
    const mockSpinner = {
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
    }
    ora.mockReturnValue(mockSpinner)

    storage.getFileList.mockResolvedValue([
      'Application_Detail_SFI23/file1',
      'Apps_Types_SFI23/file2'
    ])

    stageApplicationDetails.mockResolvedValue()
    stageAppsTypes.mockResolvedValue()

    await stageExtracts()

    expect(createAlerts).not.toHaveBeenCalled()
  })

  test('should not call createAlerts when no files to process', async () => {
    storage.getFileList.mockResolvedValue([])

    await stageExtracts()

    expect(createAlerts).not.toHaveBeenCalled()
  })

  test('should call createAlerts with multiple errors when some operations fail', async () => {
    const mockSpinner = {
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
    }
    ora.mockReturnValue(mockSpinner)

    storage.getFileList.mockResolvedValue([
      'Application_Detail_SFI23/file1',
      'Apps_Types_SFI23/file2',
      'Apps_Payment_Notification_SFI23/file3'
    ])

    stageApplicationDetails.mockResolvedValue()
    stageAppsTypes.mockRejectedValue(new Error('Types error'))
    stageAppsPaymentNotifications.mockRejectedValue(new Error('Payments error'))

    await stageExtracts()

    expect(createAlerts).toHaveBeenCalledWith([
      {
        file: etlConfig.appsTypes.folder,
        message: 'Types error'
      },
      {
        file: etlConfig.appsPaymentNotification.folder,
        message: 'Payments error'
      }
    ])
  })
})
