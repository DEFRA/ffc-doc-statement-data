const sendUpdates = require('./send-updates')
const { ORGANISATION, CALCULATION, TOTAL, DAX, DELINKEDCALCULATION } = require('./types')

const publish = async () => {
  await Promise.all([
    sendUpdates(ORGANISATION),
    sendUpdates(CALCULATION),
    sendUpdates(TOTAL),
    sendUpdates(DELINKEDCALCULATION),
    sendUpdates(DAX)
  ])
}

module.exports = publish
