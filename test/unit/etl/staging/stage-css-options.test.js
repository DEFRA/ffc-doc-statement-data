const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { cssOptions } = require('../../../../app/constants/tables')
const { stageCSSOptions } = require('../../../../app/etl/staging/stage-css-options')
const { Readable } = require('stream')

jest.mock('uuid')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/config/etl')
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
        targetColumn: 'changeType',
        targetType: 'varchar'
      },
      {
        column: 'CHANGE_TIME',
        targetColumn: 'changeTime',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'OPTION_TYPE_ID',
        targetColumn: 'optionTypeId',
        targetType: 'number'
      },
      {
        column: 'OPTION_DESCRIPTION',
        targetColumn: 'optionDescription',
        targetType: 'varchar'
      },
      {
        column: 'OPTION_LONG_DESCRIPTION',
        targetColumn: 'optionLongDescription',
        targetType: 'varchar'
      },
      {
        column: 'DURATION',
        targetColumn: 'duration',
        targetType: 'number'
      },
      {
        column: 'OPTION_CODE',
        targetColumn: 'optionCode',
        targetType: 'varchar'
      },
      {
        column: 'CONTRACT_TYPE_ID',
        targetColumn: 'contractTypeId',
        targetType: 'number'
      },
      {
        column: 'START_DT',
        targetColumn: 'startDt',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'END_DT',
        targetColumn: 'endDt',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'GROUP_ID',
        targetColumn: 'groupId',
        targetType: 'varchar'
      }
    ]

    uuidv4.mockReturnValue(mockUuid)
    const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
    const mockReadableStream = Readable.from(mockStreamData.split('\n'))
    storage.downloadFileAsStream = jest.fn().mockResolvedValue(mockReadableStream)

    await stageCSSOptions()

    expect(storage.downloadFileAsStream).toHaveBeenCalledWith(mockFile)
    expect(runEtlProcess).toHaveBeenCalledWith({
      fileStream: mockReadableStream,
      columns: mockColumns,
      table: cssOptions,
      mapping: mockMapping,
      file: mockFile,
      excludedFields: [
        'contractTypeId',
        'duration',
        'groupId',
        'optionCode',
        'optionDescription',
        'optionLongDescription',
        'optionTypeId'
      ]
    })
  })
})
