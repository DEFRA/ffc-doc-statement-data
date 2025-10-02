const { writeToString } = require('@fast-csv/format')
const storage = require('../../../app/storage')
const { stageApplicationDetails, stageAppsTypes, stageAppsPaymentNotifications, stageBusinessAddressContacts, stageCalculationDetails, stageCSSContractApplications, stageCSSContract, stageCSSOptions, stageDefraLinks, stageFinanceDAX, stageOrganisation, stageTCLCOption } = require('../../../app/etl/staging')
const { etlConfig } = require('../../../app/config')
const ora = require('ora')
const { stageDWHExtracts } = require('../../../app/etl/stage-dwh-extracts')

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

  test('should handle ora spinner for each stage function', async () => {
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

    await stageDWHExtracts()

    expect(ora).toHaveBeenCalledTimes(stageFunctions.length)
    expect(mockSpinner.start).toHaveBeenCalledTimes(stageFunctions.length)
  })
})
