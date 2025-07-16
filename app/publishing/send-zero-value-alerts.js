const { createAlerts } = require('../messaging/create-alerts')
const { ZERO_VALUE_STATEMENT } = require('../constants/alerts')
const db = require('../data')

const sendZeroValueAlerts = async () => {
  // DAX
  const daxUnsent = await db.zeroValueDax.findAll({ where: { alertSent: false } })
  if (daxUnsent.length) {
    await createAlerts(daxUnsent.map(r => r.toJSON()), ZERO_VALUE_STATEMENT)
    await db.zeroValueDax.update({ alertSent: true }, { where: { alertSent: false } })
  }
  // D365
  const d365Unsent = await db.zeroValueD365.findAll({ where: { alertSent: false } })
  if (d365Unsent.length) {
    await createAlerts(d365Unsent.map(r => r.toJSON()), ZERO_VALUE_STATEMENT)
    await db.zeroValueD365.update({ alertSent: true }, { where: { alertSent: false } })
  }
}

module.exports = sendZeroValueAlerts 