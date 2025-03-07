const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
const { stageTCLCOption } = require('../../../../app/etl/staging/stage-tclc-option')
const { tclcOption } = require('../../../../app/constants/tables')

jest.mock('path')
jest.mock('uuid', () => ({ v4: jest.fn() }))
jest.mock('../../../../app/storage', () => ({
  downloadFile: jest.fn()
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
  const mockTempFilePath = `tclcOption-${mockUuid}.csv`
  path.join.mockReturnValue(mockTempFilePath)
  storage.downloadFile.mockResolvedValue()

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
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'APPLICATION_ID', targetColumn: 'application_id', targetType: 'number' },
    { column: 'CALCULATION_ID', targetColumn: 'calculation_id', targetType: 'number' },
    { column: 'OP_CODE', targetColumn: 'op_code', targetType: 'varchar' },
    { column: 'SCO_UOM', targetColumn: 'sco_uom', targetType: 'varchar' },
    { column: 'COMMITMENT', targetColumn: 'commitment', targetType: 'number' },
    { column: 'COMMITMENT_VAL', targetColumn: 'commitment_val', targetType: 'number' },
    { column: 'AGREE_AMOUNT', targetColumn: 'agree_amount', targetType: 'number' },
    { column: 'CLAIMED_PAY_AMOUNT', targetColumn: 'claimed_pay_amount', targetType: 'number' },
    { column: 'VERIF_PAY_AMOUNT', targetColumn: 'verify_pay_amount', targetType: 'number' },
    { column: 'FOUND_AMOUNT', targetColumn: 'found_amount', targetType: 'number' },
    { column: 'OVERD_REDUCT_AMOUNT', targetColumn: 'overd_reduct_amount', targetType: 'number' },
    { column: 'OVERD_PENALTY_AMOUNT', targetColumn: 'overd_penalty_amount', targetType: 'number' },
    { column: 'NET1_AMOUNT', targetColumn: 'net1_amount', targetType: 'number' }
  ]

  await stageTCLCOption()

  expect(storage.downloadFile).toHaveBeenCalledWith('tclcOptionFolder/export.csv', mockTempFilePath)
  expect(runEtlProcess).toHaveBeenCalledWith({
    tempFilePath: mockTempFilePath,
    columns,
    table: tclcOption,
    mapping,
    file: 'tclcOptionFolder/export.csv'
  })
})
