const { writeToString } = require('@fast-csv/format')
const moment = require('moment')
const storage = require('../../../app/storage')
const { stageApplicationDetails, stageAppsTypes } = require('../../../app/etl/staging')
const { loadETLData } = require('../../../app/etl/load-etl-data')
const { storageConfig } = require('../../../app/config')
const { stageExtracts } = require('../../../app/etl/stage-extracts')

jest.mock('@fast-csv/format', () => ({
  writeToString: jest.fn()
}))

jest.mock('moment', () => jest.fn(() => ({
  format: jest.fn(() => '20240101 12:00:00')
})))

jest.mock('../../../app/storage', () => ({
  getBlob: jest.fn(),
  getFileList: jest.fn()
}))

jest.mock('../../../app/etl/staging', () => ({
  stageApplicationDetails: jest.fn(),
  stageAppsTypes: jest.fn(),
  stageAppsPaymentNotifications: jest.fn(),
  stageBusinessAddressContacts: jest.fn(),
  stageCalculationDetails: jest.fn(),
  stageCSSContractApplications: jest.fn(),
  stageCSSContract: jest.fn(),
  stageCSSOptions: jest.fn(),
  stageDefraLinks: jest.fn(),
  stageFinanceDAX: jest.fn(),
  stageOrganisation: jest.fn(),
  stageTCLCOption: jest.fn()
}))

jest.mock('../../../app/etl/load-etl-data', () => ({
  loadETLData: jest.fn()
}))

jest.mock('../../../app/config', () => ({
  storageConfig: {
    etlLogsFolder: 'etlLogsFolder',
    applicationDetail: { folder: 'appDetailFolder' },
    appsTypes: { folder: 'appsTypesFolder' },
    appsPaymentNotification: { folder: 'appsPaymentNotificationFolder' },
    businessAddress: { folder: 'businessAddressFolder' },
    calculationsDetails: { folder: 'calculationsDetailsFolder' },
    cssContractApplications: { folder: 'cssContractApplicationsFolder' },
    cssContract: { folder: 'cssContractFolder' },
    cssOptions: { folder: 'cssOptionsFolder' },
    defraLinks: { folder: 'defraLinksFolder' },
    financeDAX: { folder: 'financeDAXFolder' },
    organisation: { folder: 'organisationFolder' },
    tclcOption: { folder: 'tclcOptionFolder' }
  }
}))

global.results = []

let completed = 0
let total
let startDate

const checkComplete = async () => {
  if (completed < total) {
    setTimeout(checkComplete, 5000)
  } else {
    console.log('All ETL extracts loaded')
    const body = await writeToString(global.results)
    const outboundBlobClient = await storage.getBlob(`${storageConfig.etlLogsFolder}/ETL_Import_Results_${moment().format('YYYYMMDD HH:mm:ss')}`)
    await outboundBlobClient.upload(body, body.length)
    await loadETLData(startDate)
  }
}

test('checkComplete waits for completion and uploads results', async () => {
  completed = 1
  total = 1
  global.results = [{ table: 'testTable', data: 'testData' }]
  const mockBlobClient = { upload: jest.fn() }
  storage.getBlob.mockResolvedValue(mockBlobClient)
  writeToString.mockResolvedValue('csvContent')
  loadETLData.mockResolvedValue()

  await checkComplete()

  expect(writeToString).toHaveBeenCalledWith(global.results)
  expect(storage.getBlob).toHaveBeenCalledWith('etlLogsFolder/ETL_Import_Results_20240101 12:00:00')
  expect(mockBlobClient.upload).toHaveBeenCalledWith('csvContent', 'csvContent'.length)
  expect(loadETLData).toHaveBeenCalledWith(startDate)
})

test('stageExtracts processes ETL files and stages them', async () => {
  const etlFiles = ['appDetailFolder/file1', 'appsTypesFolder/file2']
  storage.getFileList.mockResolvedValue(etlFiles)
  const mockSpinner = {
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    failed: jest.fn().mockReturnThis()
  }
  jest.mock('@topcli/spinner', () => ({
    Spinner: jest.fn(() => mockSpinner)
  }))

  await stageExtracts()

  expect(storage.getFileList).toHaveBeenCalled()
  expect(mockSpinner.start).toHaveBeenCalledWith('appDetailFolder')
  expect(stageApplicationDetails).toHaveBeenCalled()
  expect(mockSpinner.succeed).toHaveBeenCalledWith('appDetailFolder - staged')
  expect(mockSpinner.start).toHaveBeenCalledWith('appsTypesFolder')
  expect(stageAppsTypes).toHaveBeenCalled()
  expect(mockSpinner.succeed).toHaveBeenCalledWith('appsTypesFolder - staged')
  expect(checkComplete).toHaveBeenCalled()
})
