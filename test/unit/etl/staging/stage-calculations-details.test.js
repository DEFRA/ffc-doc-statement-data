const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { calculationsDetailsTable } = require('../../../../app/constants/tables')
const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
const { stageCalculationDetails } = require('../../../../app/etl/staging/stage-calculations-details')

jest.mock('path')
jest.mock('uuid')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/config/storage')
jest.mock('../../../../app/etl/run-etl-process')
jest.mock('../../../../app/constants/tables')

describe('stageCalculationDetails', () => {
  test('should download the file and run the ETL process', async () => {
    const mockFile = 'mock-folder/export.csv'
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

    path.join.mockReturnValue(mockTempFilePath)
    uuidv4.mockReturnValue(mockUuid)
    storage.downloadFile = jest.fn().mockResolvedValue()
    runEtlProcess.mockResolvedValue()

    await stageCalculationDetails()

    expect(path.join).toHaveBeenCalledWith(__dirname, `calculationDetails-${mockUuid}.csv`)
    expect(storage.downloadFile).toHaveBeenCalledWith(mockFile, mockTempFilePath)
    expect(runEtlProcess).toHaveBeenCalledWith({
      tempFilePath: mockTempFilePath,
      columns: mockColumns,
      table: calculationsDetailsTable,
      mapping: mockMapping,
      file: mockFile
    })
  })
})
