const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
const { stageApplicationDetails } = require('../../../../app/etl/staging/stage-application-detail')
const { applicationDetail } = require('../../../../app/constants/tables')
const { Readable } = require('stream')

jest.mock('uuid', () => ({ v4: jest.fn() }))
jest.mock('../../../../app/storage', () => ({
  downloadFileAsStream: jest.fn()
}))
jest.mock('../../../../app/config/storage', () => ({
  applicationDetail: { folder: 'appDetailFolder' }
}))
jest.mock('../../../../app/constants/tables', () => ({
  applicationDetailTable: 'applicationDetailTable'
}))
jest.mock('../../../../app/etl/run-etl-process', () => ({
  runEtlProcess: jest.fn()
}))

test('stageApplicationDetails downloads file and runs ETL process', async () => {
  const mockUuid = '1234-5678-91011'
  uuidv4.mockReturnValue(mockUuid)
  const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
  const mockReadableStream = Readable.from(mockStreamData.split('\n'))
  storage.downloadFileAsStream.mockResolvedValue(mockReadableStream)

  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'PKID',
    'DT_INSERT',
    'DT_DELETE',
    'SUBJECT_ID',
    'UTE_ID',
    'APPLICATION_ID',
    'APPLICATION_CODE',
    'AMENDED_APP_ID',
    'APP_TYPE_ID',
    'PROXY_ID',
    'STATUS_P_CODE',
    'STATUS_S_CODE',
    'SOURCE_P_CODE',
    'SOURCE_S_CODE',
    'DT_START',
    'DT_END',
    'VALID_START_FLG',
    'VALID_END_FLG',
    'APP_ID_START',
    'APP_ID_END',
    'DT_REC_UPDATE',
    'USER_ID'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'PKID', targetColumn: 'pkid', targetType: 'number' },
    { column: 'DT_INSERT', targetColumn: 'dt_insert', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'DT_DELETE', targetColumn: 'dt_delete', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'SUBJECT_ID', targetColumn: 'subject_id', targetType: 'number' },
    { column: 'UTE_ID', targetColumn: 'ute_id', targetType: 'number' },
    { column: 'APPLICATION_ID', targetColumn: 'application_id', targetType: 'number' },
    { column: 'APPLICATION_CODE', targetColumn: 'application_code', targetType: 'varchar' },
    { column: 'AMENDED_APP_ID', targetColumn: 'amended_app_id', targetType: 'number' },
    { column: 'APP_TYPE_ID', targetColumn: 'app_type_id', targetType: 'number' },
    { column: 'PROXY_ID', targetColumn: 'proxy_id', targetType: 'number' },
    { column: 'STATUS_P_CODE', targetColumn: 'status_p_code', targetType: 'varchar' },
    { column: 'STATUS_S_CODE', targetColumn: 'status_s_code', targetType: 'varchar' },
    { column: 'SOURCE_P_CODE', targetColumn: 'source_p_code', targetType: 'varchar' },
    { column: 'SOURCE_S_CODE', targetColumn: 'source_s_code', targetType: 'varchar' },
    { column: 'DT_START', targetColumn: 'dt_start', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'DT_END', targetColumn: 'dt_end', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'VALID_START_FLG', targetColumn: 'valid_start_flg', targetType: 'varchar' },
    { column: 'VALID_END_FLG', targetColumn: 'valid_end_flg', targetType: 'varchar' },
    { column: 'APP_ID_START', targetColumn: 'app_id_start', targetType: 'number' },
    { column: 'APP_ID_END', targetColumn: 'app_id_end', targetType: 'number' },
    { column: 'DT_REC_UPDATE', targetColumn: 'dt_rec_update', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'USER_ID', targetColumn: 'user_id', targetType: 'varchar' }
  ]

  await stageApplicationDetails()

  expect(storage.downloadFileAsStream).toHaveBeenCalledWith('appDetailFolder/export.csv')
  expect(runEtlProcess).toHaveBeenCalledWith({
    fileStream: mockReadableStream,
    columns,
    table: applicationDetail,
    mapping,
    file: 'appDetailFolder/export.csv'
  })
})
