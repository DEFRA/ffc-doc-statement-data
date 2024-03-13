const sendUpdates = require('./send-updates')
const { ORGANISATION, CALCULATION, TOTAL, DAX } = require('./types')

const publish = async () => {
  await Promise.all([
    sendUpdates(ORGANISATION),
    sendUpdates(CALCULATION),
    sendUpdates(TOTAL),
    sendUpdates(DAX)
  ])
}

module.exports = publish
