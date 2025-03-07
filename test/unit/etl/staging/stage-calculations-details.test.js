const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { calculationsDetails } = require('../../../../app/constants/tables')
const { stageCalculationDetails } = require('../../../../app/etl/staging/stage-calculations-details')

jest.mock('uuid')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/config/storage')
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
    const mockTempFilePath = 'mock-temp-file-path'
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
        column: 'APPLICATION_ID',
        targetColumn: 'application_id',
        targetType: 'number'
      },
      {
        column: 'ID_CLC_HEADER',
        targetColumn: 'id_clc_header',
        targetType: 'number'
      },
      {
        column: 'CALCULATION_ID',
        targetColumn: 'calculation_id',
        targetType: 'number'
      },
      {
        column: 'CALCULATION_DT',
        targetColumn: 'calculation_dt',
        targetType: 'date',
        format: 'DD-MM-YYYY HH24:MI:SS'
      },
      {
        column: 'RANKED',
        targetColumn: 'ranked',
        targetType: 'number'
      }
    ]

    jest.spyOn(path, 'join').mockReturnValue(mockTempFilePath)
    uuidv4.mockReturnValue(mockUuid)
    storage.downloadFile = jest.fn().mockResolvedValue()

    await stageCalculationDetails()

    const parentDir = path.resolve(__dirname, '../../../..') + '/app/etl/staging'
    expect(path.join).toHaveBeenCalledWith(parentDir, `calculationDetails-${mockUuid}.csv`)
    expect(storage.downloadFile).toHaveBeenCalledWith(mockFile, mockTempFilePath)
    expect(runEtlProcess).toHaveBeenCalledWith({
      tempFilePath: mockTempFilePath,
      columns: mockColumns,
      table: calculationsDetails,
      mapping: mockMapping,
      file: mockFile
    })
  })
})
