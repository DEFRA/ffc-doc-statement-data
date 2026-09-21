const { dataProcessingAlert } = require('ffc-alerting-utils')
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

    const idColumn = tableName.replace('zeroValue', '').toLowerCase() + 'Id'
    const promises = unsentRecords.map(async (record) => {
      try {
        await dataProcessingAlert(
          {
            process: `sendZeroValueAlerts - ${processName}`,
            paymentReference: record.paymentReference,
            paymentAmount: record.paymentAmount,
            message: `Zero value ${processName} record found for paymentReference: ${record.paymentReference}`
          },
          ZERO_VALUE_STATEMENT,
          { throwOnPublishError: true }
        )
        await db[tableName]().where({ [idColumn]: record[idColumn] }).update({ alertSent: true })
      } catch (err) {
        console.error(`Failed to send alert for ${tableName} record ${record[idColumn]}, skipping update`, err)
      }
    })

    await Promise.all(promises)
    console.log(`[ZeroValueAlerts] Processed batch of ${unsentRecords.length} ${tableName} records.`)
  }

  // D365
  let lastD365Id = 0
  while (true) {
    const d365Unsent = await db.zeroValueD365()
      .where({ alertSent: false })
      .where('d365Id', '>', lastD365Id)
      .orderBy('d365Id', 'asc')
      .limit(BATCH_SIZE)
    if (!d365Unsent.length) {
      break
    }
    await processBatch(d365Unsent, 'zeroValueD365', 'D365')
    lastD365Id = d365Unsent[d365Unsent.length - 1].d365Id
  }
}

module.exports = sendZeroValueAlerts
