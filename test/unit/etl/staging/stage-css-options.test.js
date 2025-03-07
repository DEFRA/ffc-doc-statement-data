const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { cssOptions } = require('../../../../app/constants/tables')
const { stageCSSOptions } = require('../../../../app/etl/staging/stage-css-options')

jest.mock('uuid')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/config/storage')
jest.mock('../../../../app/constants/tables')
jest.mock('../../../../app/etl/run-etl-process')

describe('stageCSSOptions', () => {
  let runEtlProcess

  beforeAll(() => {
    runEtlProcess = require('../../../../app/etl/run-etl-process').runEtlProcess
    jest.spyOn(require('../../../../app/etl/run-etl-process'), 'runEtlProcess').mockResolvedValue()
  })

  test('should download the file and run the ETL process', async () => {
    const mockFile = 'CSS_Options/export.csv'
    const mockTempFilePath = 'mock-temp-file-path'
    const mockUuid = 'mock-uuid'
    const mockColumns = [
      'CHANGE_TYPE',
      'CHANGE_TIME',
      'OPTION_TYPE_ID',
      'OPTION_DESCRIPTION',
      'OPTION_LONG_DESCRIPTION',
      'DURATION',
      'OPTION_CODE',
      'CONTRACT_TYPE_ID',
      'START_DT',
      'END_DT',
      'GROUP_ID'
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
        column: 'OPTION_TYPE_ID',
        targetColumn: 'option_type_id',
        targetType: 'number'
      },
      {
        column: 'OPTION_DESCRIPTION',
        targetColumn: 'option_description',
        targetType: 'varchar'
      },
      {
        column: 'OPTION_LONG_DESCRIPTION',
        targetColumn: 'option_long_description',
        targetType: 'varchar'
      },
      {
        column: 'DURATION',
        targetColumn: 'duration',
        targetType: 'number'
      },
      {
        column: 'OPTION_CODE',
        targetColumn: 'option_code',
        targetType: 'varchar'
      },
      {
        column: 'CONTRACT_TYPE_ID',
        targetColumn: 'contract_type_id',
        targetType: 'number'
      },
      {
        column: 'START_DT',
        targetColumn: 'start_dt',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'END_DT',
        targetColumn: 'end_dt',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'GROUP_ID',
        targetColumn: 'group_id',
        targetType: 'varchar'
      }
    ]

    jest.spyOn(path, 'join').mockReturnValue(mockTempFilePath)
    uuidv4.mockReturnValue(mockUuid)
    storage.downloadFile = jest.fn().mockResolvedValue()

    await stageCSSOptions()

    const parentDir = path.resolve(__dirname, '../../../..') + '/app/etl/staging'
    expect(path.join).toHaveBeenCalledWith(parentDir, `cssOptions-${mockUuid}.csv`)
    expect(storage.downloadFile).toHaveBeenCalledWith(mockFile, mockTempFilePath)
    expect(runEtlProcess).toHaveBeenCalledWith({
      tempFilePath: mockTempFilePath,
      columns: mockColumns,
      table: cssOptions,
      mapping: mockMapping,
      file: mockFile
    })
  })
})
