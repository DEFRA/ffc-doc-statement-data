const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { defraLinksTable } = require('../../../../app/constants/tables')
const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
const { stageDefraLinks } = require('../../../../app/etl/staging/stage-defra-links')

jest.mock('path')
jest.mock('uuid')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/config/storage')
jest.mock('../../../../app/etl/run-etl-process')
jest.mock('../../../../app/constants/tables')

describe('stageDefraLinks', () => {
  test('should download the file and run the ETL process', async () => {
    const mockFile = 'mock-folder/export.csv'
    const mockTempFilePath = 'mock-temp-file-path'
    const mockUuid = 'mock-uuid'
    const mockColumns = [
      'CHANGE_TYPE',
      'CHANGE_TIME',
      'SUBJECT_ID',
      'DEFRA_ID',
      'DEFRA_TYPE',
      'MDM_ID'
    ]
    const mockMapping = [
      {
        column: 'CHANGE_TYPE',
        targetColumn: 'change_type',
        targetType: 'varchar'
      },
      {
        column: 'CHANGE_TIME',
        targetColumn: 'change_time',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'SUBJECT_ID',
        targetColumn: 'subject_id',
        targetType: 'number'
      },
      {
        column: 'DEFRA_ID',
        targetColumn: 'defra_id',
        targetType: 'varchar'
      },
      {
        column: 'DEFRA_TYPE',
        targetColumn: 'defra_type',
        targetType: 'varchar'
      },
      {
        column: 'MDM_ID',
        targetColumn: 'mdm_id',
        targetType: 'number'
      }
    ]

    path.join.mockReturnValue(mockTempFilePath)
    uuidv4.mockReturnValue(mockUuid)
    storage.downloadFile = jest.fn().mockResolvedValue()
    runEtlProcess.mockResolvedValue()

    await stageDefraLinks()

    expect(path.join).toHaveBeenCalledWith(__dirname, `defraLinks-${mockUuid}.csv`)
    expect(storage.downloadFile).toHaveBeenCalledWith(mockFile, mockTempFilePath)
    expect(runEtlProcess).toHaveBeenCalledWith({
      tempFilePath: mockTempFilePath,
      columns: mockColumns,
      table: defraLinksTable,
      mapping: mockMapping,
      file: mockFile
    })
  })
})
