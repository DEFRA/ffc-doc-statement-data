const { writeToString } = require('@fast-csv/format')
const storage = require('../../../app/storage')
const { stageApplicationDetails, stageAppsTypes, stageAppsPaymentNotifications, stageBusinessAddressContacts, stageCalculationDetails, stageCSSContractApplications, stageCSSContract, stageCSSOptions, stageDefraLinks, stageFinanceDAX, stageOrganisation, stageTCLCOption } = require('../../../app/etl/staging')
const { loadETLData } = require('../../../app/etl/load-etl-data')
const { storageConfig } = require('../../../app/config')
const ora = require('ora')
const { stageExtracts } = require('../../../app/etl/stage-extracts')

jest.mock('@fast-csv/format')
// jest.mock('moment');
jest.mock('../../../app/storage')
jest.mock('../../../app/etl/staging')
jest.mock('../../../app/etl/load-etl-data')
jest.mock('../../../app/config')
jest.mock('ora')

const stageFunctions = [
  { fn: stageApplicationDetails, label: storageConfig.applicationDetail.folder },
  { fn: stageAppsTypes, label: storageConfig.appsTypes.folder },
  { fn: stageAppsPaymentNotifications, label: storageConfig.appsPaymentNotification.folder },
  { fn: stageBusinessAddressContacts, label: storageConfig.businessAddress.folder },
  { fn: stageCalculationDetails, label: storageConfig.calculationsDetails.folder },
  { fn: stageCSSContractApplications, label: storageConfig.cssContractApplications.folder },
  { fn: stageCSSContract, label: storageConfig.cssContract.folder },
  { fn: stageCSSOptions, label: storageConfig.cssOptions.folder },
  { fn: stageDefraLinks, label: storageConfig.defraLinks.folder },
  { fn: stageFinanceDAX, label: storageConfig.financeDAX.folder },
  { fn: stageOrganisation, label: storageConfig.organisation.folder },
  { fn: stageTCLCOption, label: storageConfig.tclcOption.folder }
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
    storage.getFileList.mockResolvedValue(['Application_Detail/file1'])
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
    storage.getFileList.mockResolvedValue(['Application_Detail/file1'])
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
    storage.getFileList.mockResolvedValue(['Application_Detail/file1'])
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
      'Application_Detail/file1',
      'Apps_Types/file2',
      'Apps_Payment_Notification/file3',
      'Business_address_contact_v/file4',
      'Calculations_Details_MV/file5',
      'CSS_Contract_Applications/file6',
      'CSS_Contract/file7',
      'CSS_Options/file8',
      'Defra_Links/file9',
      'Finance_Dax/file10',
      'Organization/file11',
      'capd_dwh_ods.tclc_pii_pay_claim_sfimt_option/file12'
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

    storage.getFileList.mockResolvedValue(['Application_Detail/file1'])
    stageApplicationDetails.mockRejectedValue(new Error('Test error'))

    await stageExtracts()

    expect(mockSpinner.fail).toHaveBeenCalledWith(`${storageConfig.applicationDetail.folder} - Test error`)
  })
})
