const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const config = require('../../config')
const { tclcOption } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageTCLCOption = async (monthDayFormat = false, folder = 'tclcOption') => {
  const format = monthDayFormat ? monthDayYearDateTimeFormat : dateTimeFormat
  const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')

  const columns = [
    sourceColumnNames.CHANGE_TYPE,
    sourceColumnNames.CHANGE_TIME,
    sourceColumnNames.APPLICATION_ID,
    sourceColumnNames.CALCULATION_ID,
    sourceColumnNames.OP_CODE,
    sourceColumnNames.SCO_UOM,
    sourceColumnNames.COMMITMENT,
    sourceColumnNames.COMMITMENT_VAL,
    sourceColumnNames.AGREE_AMOUNT,
    sourceColumnNames.CLAIMED_PAY_AMOUNT,
    sourceColumnNames.VERIF_PAY_AMOUNT,
    sourceColumnNames.FOUND_AMOUNT,
    sourceColumnNames.OVERD_REDUCT_AMOUNT,
    sourceColumnNames.OVERD_PENALTY_AMOUNT,
    sourceColumnNames.NET1_AMOUNT
  ]

  const mapping = [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format },
    { column: sourceColumnNames.APPLICATION_ID, targetColumn: targetColumnNames.applicationId, targetType: NUMBER },
    { column: sourceColumnNames.CALCULATION_ID, targetColumn: targetColumnNames.calculationId, targetType: NUMBER },
    { column: sourceColumnNames.OP_CODE, targetColumn: targetColumnNames.opCode, targetType: VARCHAR },
    { column: sourceColumnNames.SCO_UOM, targetColumn: targetColumnNames.scoUom, targetType: VARCHAR },
    { column: sourceColumnNames.COMMITMENT, targetColumn: targetColumnNames.commitment, targetType: NUMBER },
    { column: sourceColumnNames.COMMITMENT_VAL, targetColumn: targetColumnNames.commitmentVal, targetType: NUMBER },
    { column: sourceColumnNames.AGREE_AMOUNT, targetColumn: targetColumnNames.agreeAmount, targetType: NUMBER },
    { column: sourceColumnNames.CLAIMED_PAY_AMOUNT, targetColumn: targetColumnNames.claimedPayAmount, targetType: NUMBER },
    { column: sourceColumnNames.VERIF_PAY_AMOUNT, targetColumn: targetColumnNames.verifyPayAmount, targetType: NUMBER },
    { column: sourceColumnNames.FOUND_AMOUNT, targetColumn: targetColumnNames.foundAmount, targetType: NUMBER },
    { column: sourceColumnNames.OVERD_REDUCT_AMOUNT, targetColumn: targetColumnNames.overdReductAmount, targetType: NUMBER },
    { column: sourceColumnNames.OVERD_PENALTY_AMOUNT, targetColumn: targetColumnNames.overdPenaltyAmount, targetType: NUMBER },
    { column: sourceColumnNames.NET1_AMOUNT, targetColumn: targetColumnNames.net1Amount, targetType: NUMBER }
  ]

  let excludedFields = []
  if (config.etlConfig.excludeCalculationData) {
    excludedFields = [
      targetColumnNames.agreeAmount,
      targetColumnNames.claimedPayAmount,
      targetColumnNames.commitment,
      targetColumnNames.commitmentVal,
      targetColumnNames.foundAmount,
      targetColumnNames.net1Amount,
      targetColumnNames.opCode,
      targetColumnNames.overdPenaltyAmount,
      targetColumnNames.overdReductAmount,
      targetColumnNames.scoUom,
      targetColumnNames.verifyPayAmount
    ]
  }

  return downloadAndProcessFile(folder, tclcOption, columns, mapping, excludedFields)
}

const stageTCLCOptionDelinked = async () => {
  return stageTCLCOption(true, 'tclcOptionsDelinked')
}

module.exports = {
  stageTCLCOption,
  stageTCLCOptionDelinked
}
