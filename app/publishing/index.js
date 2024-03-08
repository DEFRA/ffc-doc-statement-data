const sendUpdates = require('./send-updates')
const { ORGANISATION, CALCULATION, TOTALS, DAX } = require('./types')

const publish = async () => {
  await Promise.all([
    sendUpdates(ORGANISATION),
    sendUpdates(CALCULATION),
    sendUpdates(TOTALS),
    sendUpdates(DAX)
  ])
}

module.exports = publish
