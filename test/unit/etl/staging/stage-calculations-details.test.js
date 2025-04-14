const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { calculationsDetails } = require('../../../../app/constants/tables')
const { stageCalculationDetails } = require('../../../../app/etl/staging/stage-calculations-details')
const { Readable } = require('stream')

jest.mock('uuid')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/config/etl')
jest.mock('../../../../app/constants/tables')
jest.mock('../../../../app/etl/run-etl-process')

describe('stageCalculationDetails', () => {
  let runEtlProcess

  beforeAll(() => {
    runEtlProcess = require('../../../../app/etl/run-etl-process').runEtlProcess
    jest.spyOn(require('../../../../app/etl/run-etl-process'), 'runEtlProcess').mockResolvedValue()
  })

  test('should download the file and run the ETL process', async () => {
    const mockFile = 'Calculations_Details_MV/export.csv'
    const mockUuid = 'mock-uuid'
    const mockColumns = [
      'CHANGE_TYPE',
      'CHANGE_TIME',
      'APPLICATION_ID',
      'ID_CLC_HEADER',
      'CALCULATION_ID',
      'CALCULATION_DT',
      'RANKED'
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
        column: 'APPLICATION_ID',
        targetColumn: 'applicationId',
        targetType: 'number'
      },
      {
        column: 'ID_CLC_HEADER',
        targetColumn: 'idClcHeader',
        targetType: 'number'
      },
      {
        column: 'CALCULATION_ID',
        targetColumn: 'calculationId',
        targetType: 'number'
      },
      {
        column: 'CALCULATION_DT',
        targetColumn: 'calculationDt',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'RANKED',
        targetColumn: 'ranked',
        targetType: 'number'
      }
    ]

    uuidv4.mockReturnValue(mockUuid)
    const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
    const mockReadableStream = Readable.from(mockStreamData.split('\n'))
    storage.downloadFileAsStream = jest.fn().mockResolvedValue(mockReadableStream)

    await stageCalculationDetails()

    expect(storage.downloadFileAsStream).toHaveBeenCalledWith(mockFile)
    expect(runEtlProcess).toHaveBeenCalledWith({
      fileStream: mockReadableStream,
      columns: mockColumns,
      table: calculationsDetails,
      mapping: mockMapping,
      file: mockFile
    })
  })
})
