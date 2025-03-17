const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
const { stageTCLCOption } = require('../../../../app/etl/staging/stage-tclc-option')
const { tclcOption } = require('../../../../app/constants/tables')
const { Readable } = require('stream')

jest.mock('uuid', () => ({ v4: jest.fn() }))
jest.mock('../../../../app/storage', () => ({
  downloadFileAsStream: jest.fn()
}))
jest.mock('../../../../app/config/storage', () => ({
  tclcOption: { folder: 'tclcOptionFolder' }
}))
jest.mock('../../../../app/constants/tables', () => ({
  tclcOptionTable: 'tclcOptionTable'
}))
jest.mock('../../../../app/etl/run-etl-process', () => ({
  runEtlProcess: jest.fn()
}))

test('stageTCLCOption downloads file and runs ETL process', async () => {
  const mockUuid = '1234-5678-91011'
  uuidv4.mockReturnValue(mockUuid)
  const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
  const mockReadableStream = Readable.from(mockStreamData.split('\n'))
  storage.downloadFileAsStream.mockResolvedValue(mockReadableStream)

  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'APPLICATION_ID',
    'CALCULATION_ID',
    'OP_CODE',
    'SCO_UOM',
    'COMMITMENT',
    'COMMITMENT_VAL',
    'AGREE_AMOUNT',
    'CLAIMED_PAY_AMOUNT',
    'VERIF_PAY_AMOUNT',
    'FOUND_AMOUNT',
    'OVERD_REDUCT_AMOUNT',
    'OVERD_PENALTY_AMOUNT',
    'NET1_AMOUNT'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'changeType', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'changeTime', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'APPLICATION_ID', targetColumn: 'applicationId', targetType: 'number' },
    { column: 'CALCULATION_ID', targetColumn: 'calculationId', targetType: 'number' },
    { column: 'OP_CODE', targetColumn: 'opCode', targetType: 'varchar' },
    { column: 'SCO_UOM', targetColumn: 'scoUom', targetType: 'varchar' },
    { column: 'COMMITMENT', targetColumn: 'commitment', targetType: 'number' },
    { column: 'COMMITMENT_VAL', targetColumn: 'commitmentVal', targetType: 'number' },
    { column: 'AGREE_AMOUNT', targetColumn: 'agreeAmount', targetType: 'number' },
    { column: 'CLAIMED_PAY_AMOUNT', targetColumn: 'claimedPayAmount', targetType: 'number' },
    { column: 'VERIF_PAY_AMOUNT', targetColumn: 'verifyPayAmount', targetType: 'number' },
    { column: 'FOUND_AMOUNT', targetColumn: 'foundAmount', targetType: 'number' },
    { column: 'OVERD_REDUCT_AMOUNT', targetColumn: 'overdReductAmount', targetType: 'number' },
    { column: 'OVERD_PENALTY_AMOUNT', targetColumn: 'overdPenaltyAmount', targetType: 'number' },
    { column: 'NET1_AMOUNT', targetColumn: 'net1Amount', targetType: 'number' }
  ]

  await stageTCLCOption()

  expect(storage.downloadFileAsStream).toHaveBeenCalledWith('tclcOptionFolder/export.csv')
  expect(runEtlProcess).toHaveBeenCalledWith({
    fileStream: mockReadableStream,
    columns,
    table: tclcOption,
    mapping,
    file: 'tclcOptionFolder/export.csv'
  })
})
