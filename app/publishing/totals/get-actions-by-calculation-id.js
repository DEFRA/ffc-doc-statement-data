const db = require('../../data')

const getActionsByCalculationId = async (calculationId, transaction) => {
  return db.action.findAll({
    where: {
      calculationId
    },
    attributes: [ 'fundingCode', 'groupName', 'actionCode', 'actionName', 'rate', 'landArea', 'uom', 'annualValue', 'quarterlyValue', 'overDeclarationPenalty', 'quarterlyPaymentAmount', 'datePublished'],
    raw: true,
    transaction
  })
}

module.exports = getActionsByCalculationId
