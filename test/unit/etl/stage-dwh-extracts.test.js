const ora = require('ora')
const storage = require('../../../app/storage')
const staging = require('../../../app/etl/staging')
const { etlConfig } = require('../../../app/config')
const { stageDWHExtracts } = require('../../../app/etl/stage-dwh-extracts')
const { loadETLData } = require('../../../app/etl/load-etl-data')
const { createAlerts } = require('../../../app/messaging/create-alerts')

jest.mock('../../../app/storage')
jest.mock('../../../app/etl/staging')
jest.mock('../../../app/etl/load-etl-data')
jest.mock('../../../app/config')
jest.mock('ora')
jest.mock('../../../app/messaging/create-alerts')

const mockSpinner = { start: jest.fn().mockReturnThis(), succeed: jest.fn().mockReturnThis(), fail: jest.fn().mockReturnThis() }
ora.mockReturnValue(mockSpinner)

console.info = jest.fn()
console.error = jest.fn()

beforeEach(() => jest.clearAllMocks())

const resetFlags = () => {
  etlConfig.delinkedEnabled = false
}

describe('stageDWHExtracts', () => {
  test.each([
    { files: [], expected: 'No DWH files identified for processing' },
    { files: ['Some_Other_File/file1'], expected: 'No matching DWH files identified for processing' }
  ])('logs info when no files match', async ({ files, expected }) => {
    storage.getFileList.mockResolvedValue(files)
    await stageDWHExtracts()
    expect(console.info).toHaveBeenCalledWith(expected)
  })

  test('stages all functions successfully', async () => {
    storage.getFileList.mockResolvedValue(['Application_Detail_Delinked/file1', 'Apps_Types_Delinked/file2'])
    staging.stageApplicationDetails.mockResolvedValue()
    staging.stageAppsTypes.mockResolvedValue()

    await stageDWHExtracts()

    expect(mockSpinner.succeed).toHaveBeenCalledTimes(2)
    expect(loadETLData).toHaveBeenCalled()
    expect(storage.deleteAllETLExtracts).toHaveBeenCalled()
  })

  test('handles single staging failure', async () => {
    storage.getFileList.mockResolvedValue(['Application_Detail_Delinked/file1', 'Apps_Types_Delinked/file2'])
    staging.stageApplicationDetails.mockResolvedValue()
    staging.stageAppsTypes.mockRejectedValue(new Error('Processing error'))

    await stageDWHExtracts()

    expect(mockSpinner.fail).toHaveBeenCalledWith('Apps_Types_Delinked - Processing error')
    expect(createAlerts).toHaveBeenCalledWith([{ file: etlConfig.appsTypesDelinked.folder, message: 'Processing error' }])
    expect(storage.deleteAllETLExtracts).toHaveBeenCalled()
  })

  test('handles multiple staging failures', async () => {
    storage.getFileList.mockResolvedValue(['Application_Detail_Delinked/file1', 'Apps_Types_Delinked/file2'])
    staging.stageApplicationDetails.mockRejectedValue(new Error('Detail error'))
    staging.stageAppsTypes.mockRejectedValue(new Error('Type error'))

    await stageDWHExtracts()

    expect(mockSpinner.fail).toHaveBeenCalledTimes(2)
    expect(mockSpinner.fail).toHaveBeenCalledWith('Application_Detail_Delinked - Detail error')
    expect(mockSpinner.fail).toHaveBeenCalledWith('Apps_Types_Delinked - Type error')
    expect(createAlerts).toHaveBeenCalledWith([
      { file: etlConfig.applicationDetailDelinked.folder, message: 'Detail error' },
      { file: etlConfig.appsTypesDelinked.folder, message: 'Type error' }
    ])
    expect(storage.deleteAllETLExtracts).toHaveBeenCalled()
  })

  test('includes delinked stages when flag enabled', async () => {
    resetFlags()
    etlConfig.delinkedEnabled = true

    storage.getFileList.mockResolvedValue([
      etlConfig.applicationDetailDelinked.folder + '/file3',
      etlConfig.appsTypesDelinked.folder + '/file4'
    ])
    staging.stageApplicationDetails.mockResolvedValue()
    staging.stageAppsTypes.mockResolvedValue()

    await stageDWHExtracts()

    expect(staging.stageApplicationDetails).toHaveBeenCalled()
    expect(staging.stageAppsTypes).toHaveBeenCalled()
    expect(mockSpinner.succeed).toHaveBeenCalledWith(`${etlConfig.applicationDetailDelinked.folder} - staged`)
    expect(mockSpinner.succeed).toHaveBeenCalledWith(`${etlConfig.appsTypesDelinked.folder} - staged`)
    expect(loadETLData).toHaveBeenCalled()
    expect(storage.deleteAllETLExtracts).toHaveBeenCalled()
  })
})
