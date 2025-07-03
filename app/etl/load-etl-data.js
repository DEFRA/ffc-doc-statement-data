const { Transaction } = require('sequelize')
const db = require('../data')
const { loadIntermFinanceDAX, loadIntermCalcOrg, loadIntermOrg, loadIntermApplicationClaim, loadIntermApplicationContract, loadIntermApplicationPayment, loadIntermTotal, loadDAX, loadIntermTotalClaim, loadIntermPaymentrefApplication, loadIntermPaymentrefOrg, loadIntermPaymentrefAgreementDates, loadTotals, loadOrganisations, loadIntermAppCalcResultsDelinkPayment, loadIntermFinanceDAXDelinked, loadDelinkedCalculation, loadIntermTotalDelinked, loadD365, loadIntermApplicationClaimDelinked, loadIntermOrgDelinked, loadIntermCalcOrgDelinked, loadIntermTotalZeroValues, loadIntermTotalZeroValuesDelinked } = require('./load-scripts')
const { deleteETLRecords } = require('./delete-etl-records')

const loadETLData = async (startDate) => {
  console.log(`Starting ETL data load at ${new Date().toISOString()}`)

  // Split transactions into two because when the first one accesses data
  // a snapshot of the database is created. But data is added outside of the
  // transaction after this which queries now in the second transaction require.
  const firstTransaction = await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })
  const secondTransaction = await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })

  // Wrap each load function with logging
  const wrapWithLogging = (fn, name, maxRetries = 3, baseDelay = 500) => async (_startDate = null, transaction = null) => {
    console.log(`Starting ${name} at ${new Date().toISOString()} using startDate: ${_startDate}`)

    let attempt = 0
    while (attempt <= maxRetries) {
      try {
        const result = transaction ? await fn(_startDate, transaction) : await fn(_startDate)
        console.log(`Completed ${name} at ${new Date().toISOString()}`)
        return result
      } catch (error) {
        attempt++
        if (attempt > maxRetries) {
          console.error(`Error in ${name} after ${maxRetries} retries: ${error.message}`)
          throw error
        }

        const delay = baseDelay * 2 ** (attempt - 1)
        console.warn(`Retrying ${name} (attempt ${attempt} of ${maxRetries}) after ${delay}ms due to error: ${error.message}`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    return null
  }

  try {
    await wrapWithLogging(loadIntermFinanceDAX, 'loadIntermFinanceDAX')(startDate)
    await wrapWithLogging(loadIntermFinanceDAXDelinked, 'loadIntermFinanceDAXDelinked')(startDate)
    await wrapWithLogging(loadIntermOrg, 'loadIntermOrg')(startDate)
    await wrapWithLogging(loadIntermOrgDelinked, 'loadIntermOrgDelinked')(startDate)
    await wrapWithLogging(loadIntermApplicationClaim, 'loadIntermApplicationClaim')(startDate)
    await wrapWithLogging(loadIntermApplicationClaimDelinked, 'loadIntermApplicationClaimDelinked')(startDate)
    await wrapWithLogging(loadIntermApplicationContract, 'loadIntermApplicationContract')(startDate)
    await wrapWithLogging(loadIntermApplicationPayment, 'loadIntermApplicationPayment')(startDate)

    await wrapWithLogging(loadIntermCalcOrg, 'loadIntermCalcOrg')(startDate)
    await wrapWithLogging(loadIntermCalcOrgDelinked, 'loadIntermCalcOrgDelinked')(startDate)
    await wrapWithLogging(loadIntermTotal, 'loadIntermTotal')(startDate)
    await wrapWithLogging(loadIntermTotalZeroValues, 'loadIntermTotalZeroValues')(startDate)
    await wrapWithLogging(loadIntermTotalZeroValuesDelinked, 'loadIntermTotalZeroValuesDelinked')(startDate)
    await wrapWithLogging(loadIntermTotalDelinked, 'loadIntermTotalDelinked')(startDate)
    await wrapWithLogging(loadOrganisations, 'loadOrganisations')(startDate, firstTransaction)
    await wrapWithLogging(loadIntermPaymentrefAgreementDates, 'loadIntermPaymentrefAgreementDates')(startDate)

    await wrapWithLogging(loadDAX, 'loadDAX')(startDate, firstTransaction)

    await firstTransaction.commit()

    await wrapWithLogging(loadIntermAppCalcResultsDelinkPayment, 'loadIntermAppCalcResultsDelinkPayment')(startDate)
    await wrapWithLogging(loadIntermTotalClaim, 'loadIntermTotalClaim')(startDate)
    await wrapWithLogging(loadIntermPaymentrefApplication, 'loadIntermPaymentrefApplication')(startDate)

    await wrapWithLogging(loadIntermPaymentrefOrg, 'loadIntermPaymentrefOrg')(startDate)
    await wrapWithLogging(loadTotals, 'loadTotals')(startDate, secondTransaction)
    await wrapWithLogging(loadDelinkedCalculation, 'loadDelinkedCalculation')(startDate, secondTransaction)
    await wrapWithLogging(loadD365, 'loadD365')(startDate, secondTransaction)

    await secondTransaction.commit()
    console.log(`ETL data successfully loaded at ${new Date().toISOString()}`)
  } catch (error) {
    console.error(`Error loading ETL data: ${error.message} at ${new Date().toISOString()}`)
    await deleteETLRecords(startDate)
    await firstTransaction.rollback()
    await secondTransaction.rollback()
    throw error
  }
}

module.exports = {
  loadETLData
}
