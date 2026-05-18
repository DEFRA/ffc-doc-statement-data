const { randomUUID } = require('node:crypto')
const storage = require('../../../../app/storage')
const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
const { stageAppsTypes } = require('../../../../app/etl/staging/stage-apps-types')
const { appsTypesDelinked } = require('../../../../app/constants/tables')
const { Readable } = require('stream')

jest.mock('node:crypto', () => ({ randomUUID: jest.fn() }))
jest.mock('../../../../app/storage', () => ({
  downloadFileAsStream: jest.fn()
}))
jest.mock('../../../../app/config/dwh', () => ({
  appsTypesDelinked: { folder: 'appsTypesFolder' }
}))
jest.mock('../../../../app/constants/tables', () => ({
  appsTypesDelinked: 'appsTypesTable'
}))
jest.mock('../../../../app/etl/run-etl-process', () => ({
  runEtlProcess: jest.fn()
}))

test('stageAppsTypes downloads file and runs ETL process', async () => {
  const mockUuid = '1234-5678-91011'
  randomUUID.mockReturnValue(mockUuid)
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
    { column: 'CHANGE_TYPE', targetColumn: 'changeType', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'changeTime', targetType: 'date', format: 'MM-DD-YYYY HH24:MI:SS' },
    { column: 'APP_TYPE_ID', targetColumn: 'appTypeId', targetType: 'number' },
    { column: 'SECTOR_P_CODE', targetColumn: 'sectorPCode', targetType: 'varchar' },
    { column: 'SECTOR_S_CODE', targetColumn: 'sectorSCode', targetType: 'varchar' },
    { column: 'SHORT_DESCRIPTION', targetColumn: 'shortDescription', targetType: 'varchar' },
    { column: 'EXT_DESCRIPTION', targetColumn: 'extDescription', targetType: 'varchar' },
    { column: 'YEAR', targetColumn: 'year', targetType: 'number' },
    { column: 'WIN_OPEN_DATE', targetColumn: 'winOpenDate', targetType: 'date', format: 'MM-DD-YYYY HH24:MI:SS' },
    { column: 'WIN_CLOSE_DATE', targetColumn: 'winCloseDate', targetType: 'date', format: 'MM-DD-YYYY HH24:MI:SS' }
  ]

  await stageAppsTypes()

  expect(storage.downloadFileAsStream).toHaveBeenCalledWith('appsTypesFolder/export.csv')
  expect(runEtlProcess).toHaveBeenCalledWith({
    fileStream: mockReadableStream,
    columns,
    table: appsTypesDelinked,
    mapping,
    file: 'appsTypesFolder/export.csv',
    excludedFields: []
  })
})
