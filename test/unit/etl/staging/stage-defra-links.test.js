const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { defraLinks } = require('../../../../app/constants/tables')
const { stageDefraLinks } = require('../../../../app/etl/staging/stage-defra-links')
const { Readable } = require('stream')

jest.mock('uuid')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/config/storage')
jest.mock('../../../../app/constants/tables')
jest.mock('../../../../app/etl/run-etl-process')

describe('stageDefraLinks', () => {
  let runEtlProcess

  beforeAll(() => {
    runEtlProcess = require('../../../../app/etl/run-etl-process').runEtlProcess
    jest.spyOn(require('../../../../app/etl/run-etl-process'), 'runEtlProcess').mockResolvedValue()
  })

  test('should download the file and run the ETL process', async () => {
    const mockFile = 'Defra_Links/export.csv'
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

    uuidv4.mockReturnValue(mockUuid)
    const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
    const mockReadableStream = Readable.from(mockStreamData.split('\n'))
    storage.downloadFileAsStream = jest.fn().mockResolvedValue(mockReadableStream)

    await stageDefraLinks()

    expect(storage.downloadFileAsStream).toHaveBeenCalledWith(mockFile)
    expect(runEtlProcess).toHaveBeenCalledWith({
      fileStream: mockReadableStream,
      columns: mockColumns,
      table: defraLinks,
      mapping: mockMapping,
      file: mockFile
    })
  })
})
