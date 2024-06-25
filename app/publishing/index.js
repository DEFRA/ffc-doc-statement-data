const sendUpdates = require('./send-updates')
const { ORGANISATION, CALCULATION, TOTAL, DAX, DELINKEDCALCULATION } = require('./types')

const publish = async () => {
  await Promise.all([
    sendUpdates(ORGANISATION),
    sendUpdates(CALCULATION),
    sendUpdates(TOTAL),
    sendUpdates(DAX),
    sendUpdates(DELINKEDCALCULATION)
  ])
}

module.exports = publish
