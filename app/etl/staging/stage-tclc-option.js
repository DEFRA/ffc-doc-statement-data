const { tclcOptionTable } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat } = require('./stage-utils')

const stageTCLCOption = async () => {
  const columns = [
    'CHANGE_TYPE', 'CHANGE_TIME', 'APPLICATION_ID', 'CALCULATION_ID', 'OP_CODE', 'SCO_UOM', 'COMMITMENT', 'COMMITMENT_VAL', 'AGREE_AMOUNT', 'CLAIMED_PAY_AMOUNT', 'VERIF_PAY_AMOUNT', 'FOUND_AMOUNT', 'OVERD_REDUCT_AMOUNT', 'OVERD_PENALTY_AMOUNT', 'NET1_AMOUNT'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format: dateTimeFormat },
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

  return downloadAndProcessFile('tclcOption', 'tclcOptions', tclcOptionTable, columns, mapping)
}

module.exports = {
  stageTCLCOption
}
