const db = require('../../data')

const getActionsByCalculationId = async (calculationId, transaction) => {
  return db.action(transaction ?? undefined)
    .where({ calculationId })
    .select('actionId', { actionReference: 'actionId' }, { calculationReference: 'calculationId' }, 'fundingCode', 'groupName', 'actionCode', 'actionName', 'rate', 'landArea', 'uom', 'annualValue', 'quarterlyValue', 'overDeclarationPenalty', 'quarterlyPaymentAmount', 'datePublished')
}

module.exports = getActionsByCalculationId
