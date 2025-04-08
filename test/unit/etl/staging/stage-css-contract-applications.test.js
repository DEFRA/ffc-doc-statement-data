const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { cssContractApplications } = require('../../../../app/constants/tables')
const { stageCSSContractApplications } = require('../../../../app/etl/staging/stage-css-contract-applications')
const { Readable } = require('stream')

jest.mock('uuid')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/config/etl')
jest.mock('../../../../app/constants/tables')
jest.mock('../../../../app/etl/run-etl-process')

describe('stageCSSContractApplications', () => {
  let runEtlProcess

  beforeAll(() => {
    runEtlProcess = require('../../../../app/etl/run-etl-process').runEtlProcess
    jest.spyOn(require('../../../../app/etl/run-etl-process'), 'runEtlProcess').mockResolvedValue()
  })

  test('should download the file and run the ETL process', async () => {
    const mockFile = 'CSS_Contract_Applications/export.csv'
    const mockUuid = 'mock-uuid'
    const mockColumns = [
      'CHANGE_TYPE',
      'CHANGE_TIME',
      'PKID',
      'INSERT_DT',
      'DELETE_DT',
      'CONTRACT_ID',
      'APPLICATION_ID',
      'TYPE_P_CODE',
      'TYPE_S_CODE',
      'DATA_SOURCE_P_CODE',
      'DATA_SOURCE_S_CODE',
      'START_DT',
      'END_DT',
      'VALID_START_FLAG',
      'VALID_END_FLAG',
      'START_ACT_ID',
      'END_ACT_ID',
      'LAST_UPDATE_DT',
      'USER_FLD'
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
        column: 'PKID',
        targetColumn: 'pkid',
        targetType: 'number'
      },
      {
        column: 'INSERT_DT',
        targetColumn: 'insertDt',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'DELETE_DT',
        targetColumn: 'deleteDt',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'CONTRACT_ID',
        targetColumn: 'contractId',
        targetType: 'number'
      },
      {
        column: 'APPLICATION_ID',
        targetColumn: 'applicationId',
        targetType: 'number'
      },
      {
        column: 'TYPE_P_CODE',
        targetColumn: 'typePCode',
        targetType: 'varchar'
      },
      {
        column: 'TYPE_S_CODE',
        targetColumn: 'typeSCode',
        targetType: 'varchar'
      },
      {
        column: 'DATA_SOURCE_P_CODE',
        targetColumn: 'dataSourcePCode',
        targetType: 'varchar'
      },
      {
        column: 'DATA_SOURCE_S_CODE',
        targetColumn: 'dataSourceSCode',
        targetType: 'varchar'
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
        column: 'VALID_START_FLAG',
        targetColumn: 'validStartFlag',
        targetType: 'varchar'
      },
      {
        column: 'VALID_END_FLAG',
        targetColumn: 'validEndFlag',
        targetType: 'varchar'
      },
      {
        column: 'START_ACT_ID',
        targetColumn: 'startActId',
        targetType: 'number'
      },
      {
        column: 'END_ACT_ID',
        targetColumn: 'endActId',
        targetType: 'number'
      },
      {
        column: 'LAST_UPDATE_DT',
        targetColumn: 'lastUpdateDt',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'USER_FLD',
        targetColumn: 'user',
        targetType: 'varchar'
      }
    ]

    uuidv4.mockReturnValue(mockUuid)
    const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
    const mockReadableStream = Readable.from(mockStreamData.split('\n'))
    storage.downloadFileAsStream = jest.fn().mockResolvedValue(mockReadableStream)

    await stageCSSContractApplications()

    expect(storage.downloadFileAsStream).toHaveBeenCalledWith(mockFile)
    expect(runEtlProcess).toHaveBeenCalledWith({
      fileStream: mockReadableStream,
      columns: mockColumns,
      table: cssContractApplications,
      mapping: mockMapping,
      file: mockFile,
      excludedFields: [
        'dataSourcePCode',
        'deleteDt',
        'endActId',
        'insertDt',
        'lastUpdateDt',
        'startActId',
        'typePCode',
        'typeSCode',
        'user',
        'validEndFlag',
        'validStartFlag'
      ]
    })
  })
})
