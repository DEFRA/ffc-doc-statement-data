const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
const { stageAppsTypes } = require('../../../../app/etl/staging/stage-apps-types')
const { appsTypes } = require('../../../../app/constants/tables')
const { Readable } = require('stream')

jest.mock('uuid', () => ({ v4: jest.fn() }))
jest.mock('../../../../app/storage', () => ({
  downloadFileAsStream: jest.fn()
}))
jest.mock('../../../../app/config/storage', () => ({
  appsTypes: { folder: 'appsTypesFolder' }
}))
jest.mock('../../../../app/constants/tables', () => ({
  appsTypesTable: 'appsTypesTable'
}))
jest.mock('../../../../app/etl/run-etl-process', () => ({
  runEtlProcess: jest.fn()
}))

test('stageAppsTypes downloads file and runs ETL process', async () => {
  const mockUuid = '1234-5678-91011'
  uuidv4.mockReturnValue(mockUuid)
  const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
  const mockReadableStream = Readable.from(mockStreamData.split('\n'))
  storage.downloadFileAsStream.mockResolvedValue(mockReadableStream)

  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'APP_TYPE_ID',
    'SECTOR_P_CODE',
    'SECTOR_S_CODE',
    'SHORT_DESCRIPTION',
    'EXT_DESCRIPTION',
    'YEAR',
    'WIN_OPEN_DATE',
    'WIN_CLOSE_DATE'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'APP_TYPE_ID', targetColumn: 'app_type_id', targetType: 'number' },
    { column: 'SECTOR_P_CODE', targetColumn: 'sector_p_code', targetType: 'varchar' },
    { column: 'SECTOR_S_CODE', targetColumn: 'sector_s_code', targetType: 'varchar' },
    { column: 'SHORT_DESCRIPTION', targetColumn: 'short_description', targetType: 'varchar' },
    { column: 'EXT_DESCRIPTION', targetColumn: 'ext_description', targetType: 'varchar' },
    { column: 'YEAR', targetColumn: 'year', targetType: 'number' },
    { column: 'WIN_OPEN_DATE', targetColumn: 'win_open_date', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'WIN_CLOSE_DATE', targetColumn: 'win_close_date', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' }
  ]

  await stageAppsTypes()

  expect(storage.downloadFileAsStream).toHaveBeenCalledWith('appsTypesFolder/export.csv')
  expect(runEtlProcess).toHaveBeenCalledWith({
    fileStream: mockReadableStream,
    columns,
    table: appsTypes,
    mapping,
    file: 'appsTypesFolder/export.csv'
  })
})
