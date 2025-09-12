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

    const idColumn = tableName.replace('zeroValue', '').toLowerCase() + 'Id'
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
        await db[tableName].update({ alertSent: true }, { where: { [idColumn]: record[idColumn] } })
      } catch (err) {
        console.error(`Failed to send alert for ${tableName} record ${record[idColumn]}, skipping update`, err)
      }
    })

    await Promise.all(promises)
    console.log(`[ZeroValueAlerts] Processed batch of ${unsentRecords.length} ${tableName} records.`)
  }

  // DAX
  let lastDaxId = 0
  while (true) {
    const daxUnsent = await db.zeroValueDax.findAll({
      where: {
        alertSent: false,
        daxId: { [db.Sequelize.Op.gt]: lastDaxId }
      },
      order: [['daxId', 'ASC']],
      limit: BATCH_SIZE
    })
    if (!daxUnsent.length) break
    await processBatch(daxUnsent, 'zeroValueDax', 'DAX')
    lastDaxId = daxUnsent[daxUnsent.length - 1].daxId
  }

  // D365
  let lastD365Id = 0
  while (true) {
    const d365Unsent = await db.zeroValueD365.findAll({
      where: {
        alertSent: false,
        d365Id: { [db.Sequelize.Op.gt]: lastD365Id }
      },
      order: [['d365Id', 'ASC']],
      limit: BATCH_SIZE
    })
    if (!d365Unsent.length) break
    await processBatch(d365Unsent, 'zeroValueD365', 'D365')
    lastD365Id = d365Unsent[d365Unsent.length - 1].d365Id
  }
}

module.exports = sendZeroValueAlerts