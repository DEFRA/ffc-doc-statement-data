const { dataProcessingAlert } = require('../messaging/processing-alerts')
const { ZERO_VALUE_STATEMENT } = require('../constants/alerts')
const db = require('../data')

const sendZeroValueAlerts = async () => {
  const BATCH_SIZE = 500

  const processBatch = async (unsentRecords, tableName, processName) => {
    if (!unsentRecords.length) {
      console.log(`[ZeroValueAlerts] No unsent ${tableName} zero value records found.`)
      return
    }

    console.log(`[ZeroValueAlerts] Found ${unsentRecords.length} unsent ${tableName} zero value records. Sending alerts...`)

    const promises = unsentRecords.map(async (record) => {
      try {
        await dataProcessingAlert(
          {
            process: `sendZeroValueAlerts - ${processName}`,
            paymentReference: record.paymentReference,
            paymentAmount: record.paymentAmount,
            error: new Error(`Zero value ${processName} record found for paymentReference: ${record.paymentReference}`)
          },
          ZERO_VALUE_STATEMENT,
          { throwOnPublishError: true }
        )
        await db[tableName].update({ alertSent: true }, { where: { id: record.id } })
      } catch (err) {
        console.error(`Failed to send alert for ${tableName} record ${record.id}, skipping update`, err)
      }
    })

    await Promise.all(promises)
    console.log(`[ZeroValueAlerts] Processed batch of ${unsentRecords.length} ${tableName} records.`)
  }

  // DAX
  let offset = 0
  let hasMore = true
  while (hasMore) {
    const { rows: daxUnsent, count } = await db.zeroValueDax.findAndCountAll({
      where: { alertSent: false },
      limit: BATCH_SIZE,
      offset
    })
    await processBatch(daxUnsent, 'zeroValueDax', 'DAX')
    offset += BATCH_SIZE
    if (offset >= count) {
      hasMore = false
    }
  }

  // D365
  offset = 0
  hasMore = true
  while (hasMore) {
    const { rows: d365Unsent, count } = await db.zeroValueD365.findAndCountAll({
      where: { alertSent: false },
      limit: BATCH_SIZE,
      offset
    })
    await processBatch(d365Unsent, 'zeroValueD365', 'D365')
    offset += BATCH_SIZE
    if (offset >= count) {
      hasMore = false
    }
  }
}

module.exports = sendZeroValueAlerts
