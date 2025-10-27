const storage = require('../../../app/storage')
const {
  stageApplicationDetails,
  stageAppsTypes
} = require('../../../app/etl/staging')
const { etlConfig } = require('../../../app/config')
const ora = require('ora')
const { stageDWHExtracts } = require('../../../app/etl/stage-dwh-extracts')
const { loadETLData } = require('../../../app/etl/load-etl-data')
const { createAlerts } = require('../../../app/messaging/create-alerts')
const staging = require('../../../app/etl/staging')

jest.mock('@fast-csv/format')
jest.mock('../../../app/storage')
jest.mock('../../../app/etl/staging')
jest.mock('../../../app/etl/load-etl-data')
jest.mock('../../../app/config')
jest.mock('ora')
jest.mock('../../../app/messaging/create-alerts')

const mockSpinner = {
  start: jest.fn().mockReturnThis(),
  succeed: jest.fn().mockReturnThis(),
  fail: jest.fn().mockReturnThis()
}

console.info = jest.fn()
console.error = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ora.mockReturnValue(mockSpinner)
})

describe('ETL Process', () => {
  test('should log info when no DWH files are identified for processing', async () => {
    storage.getFileList.mockResolvedValue([])

    await stageDWHExtracts()

    expect(console.info).toHaveBeenCalledWith('No DWH files identified for processing')
  })

  test('should log info when no matching DWH files are found', async () => {
    storage.getFileList.mockResolvedValue(['Some_Other_File/file1'])

    await stageDWHExtracts()

    expect(console.info).toHaveBeenCalledWith('No matching DWH files identified for processing')
  })

  test('should handle all staging functions successfully', async () => {
    storage.getFileList.mockResolvedValue([
      'Application_Detail_SFI23/file1',
      'Apps_Types_SFI23/file2'
    ])

    stageApplicationDetails.mockResolvedValue()
    stageAppsTypes.mockResolvedValue()

    await stageDWHExtracts()

    expect(mockSpinner.succeed).toHaveBeenCalledTimes(2)
    expect(loadETLData).toHaveBeenCalled()
    expect(storage.deleteAllETLExtracts).toHaveBeenCalled()
  })

  test('should handle failures in staging functions', async () => {
    storage.getFileList.mockResolvedValue([
      'Application_Detail_SFI23/file1',
      'Apps_Types_SFI23/file2'
    ])

    stageApplicationDetails.mockResolvedValue()
    stageAppsTypes.mockRejectedValue(new Error('Processing error'))

    await stageDWHExtracts()

    expect(mockSpinner.fail).toHaveBeenCalledWith('Apps_Types_SFI23 - Processing error')
    expect(createAlerts).toHaveBeenCalledWith([
      { file: etlConfig.appsTypes.folder, message: 'Processing error' }
    ])
    expect(storage.deleteAllETLExtracts).toHaveBeenCalled()
  })

  test('should handle multiple failures in staging functions', async () => {
    storage.getFileList.mockResolvedValue([
      'Application_Detail_SFI23/file1',
      'Apps_Types_SFI23/file2'
    ])

    stageApplicationDetails.mockRejectedValue(new Error('Detail error'))
    stageAppsTypes.mockRejectedValue(new Error('Type error'))

    await stageDWHExtracts()

    expect(mockSpinner.fail).toHaveBeenCalledTimes(2)
    expect(mockSpinner.fail).toHaveBeenCalledWith('Application_Detail_SFI23 - Detail error')
    expect(mockSpinner.fail).toHaveBeenCalledWith('Apps_Types_SFI23 - Type error')

    expect(createAlerts).toHaveBeenCalledWith([
      { file: etlConfig.applicationDetail.folder, message: 'Detail error' },
      { file: etlConfig.appsTypes.folder, message: 'Type error' }
    ])
    expect(storage.deleteAllETLExtracts).toHaveBeenCalled()
  })

  test('should include delinked stage functions when delinkedEnabled = true', async () => {
    etlConfig.delinkedEnabled = true

    storage.getFileList.mockResolvedValue([
      etlConfig.applicationDetailDelinked.folder + '/file1',
      etlConfig.appsTypesDelinked.folder + '/file2'
    ])

    staging.stageApplicationDetailsDelinked.mockResolvedValue()
    staging.stageAppsTypesDelinked.mockResolvedValue()

    await stageDWHExtracts()

    expect(staging.stageApplicationDetailsDelinked).toHaveBeenCalled()
    expect(staging.stageAppsTypesDelinked).toHaveBeenCalled()

    expect(mockSpinner.succeed).toHaveBeenCalledWith(`${etlConfig.applicationDetailDelinked.folder} - staged`)
    expect(mockSpinner.succeed).toHaveBeenCalledWith(`${etlConfig.appsTypesDelinked.folder} - staged`)

    expect(loadETLData).toHaveBeenCalled()
    expect(storage.deleteAllETLExtracts).toHaveBeenCalled()
  })

  test('should include both sfi23 and delinked stage functions when both flags enabled', async () => {
    etlConfig.sfi23Enabled = true
    etlConfig.delinkedEnabled = true

    storage.getFileList.mockResolvedValue([
      etlConfig.applicationDetail.folder + '/file1',
      etlConfig.appsTypes.folder + '/file2',
      etlConfig.applicationDetailDelinked.folder + '/file3',
      etlConfig.appsTypesDelinked.folder + '/file4'
    ])

    staging.stageApplicationDetails.mockResolvedValue()
    staging.stageAppsTypes.mockResolvedValue()
    staging.stageApplicationDetailsDelinked.mockResolvedValue()
    staging.stageAppsTypesDelinked.mockResolvedValue()

    await stageDWHExtracts()

    expect(staging.stageApplicationDetails).toHaveBeenCalled()
    expect(staging.stageAppsTypes).toHaveBeenCalled()
    expect(staging.stageApplicationDetailsDelinked).toHaveBeenCalled()
    expect(staging.stageAppsTypesDelinked).toHaveBeenCalled()

    expect(mockSpinner.succeed).toHaveBeenCalledWith(`${etlConfig.applicationDetail.folder} - staged`)
    expect(mockSpinner.succeed).toHaveBeenCalledWith(`${etlConfig.appsTypes.folder} - staged`)
    expect(mockSpinner.succeed).toHaveBeenCalledWith(`${etlConfig.applicationDetailDelinked.folder} - staged`)
    expect(mockSpinner.succeed).toHaveBeenCalledWith(`${etlConfig.appsTypesDelinked.folder} - staged`)

    expect(loadETLData).toHaveBeenCalled()
    expect(storage.deleteAllETLExtracts).toHaveBeenCalled()
  })
})
