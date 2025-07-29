const { createAlerts } = require('../messaging/create-alerts')
const { ZERO_VALUE_STATEMENT } = require('../constants/alerts')
const db = require('../data')

const sendZeroValueAlerts = async () => {
  // DAX
  const daxUnsent = await db.zeroValueDax.findAll({ where: { alertSent: false } })
  if (daxUnsent.length) {
    console.log(`[ZeroValueAlerts] Found ${daxUnsent.length} unsent DAX zero value records. Sending alerts...`)
    await createAlerts(
      daxUnsent.map(r => {
        const obj = r.toJSON()
        obj.message = `Dax zero value alert for ${r.daxId}`
        return obj
      }),
      ZERO_VALUE_STATEMENT
    )
    await db.zeroValueDax.update({ alertSent: true }, { where: { alertSent: false } })
    console.log(`[ZeroValueAlerts] Sent alerts and marked as sent for ${daxUnsent.length} DAX records.`)
  } else {
    console.log('[ZeroValueAlerts] No unsent DAX zero value records found.')
  }
  // D365
  const d365Unsent = await db.zeroValueD365.findAll({ where: { alertSent: false } })
  if (d365Unsent.length) {
    console.log(`[ZeroValueAlerts] Found ${d365Unsent.length} unsent D365 zero value records. Sending alerts...`)
    await createAlerts(
      d365Unsent.map(r => {
        const obj = r.toJSON()
        obj.message = `D365 zero value alert for ${r.d365Id}`
        return obj
      }),
      ZERO_VALUE_STATEMENT
    )
    await db.zeroValueD365.update({ alertSent: true }, { where: { alertSent: false } })
    console.log(`[ZeroValueAlerts] Sent alerts and marked as sent for ${d365Unsent.length} D365 records.`)
  } else {
    console.log('[ZeroValueAlerts] No unsent D365 zero value records found.')
  }
}

module.exports = sendZeroValueAlerts
