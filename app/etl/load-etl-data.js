const { Transaction } = require('sequelize')
const db = require('../data')
const { loadIntermFinanceDAX, loadIntermCalcOrg, loadIntermOrg, loadIntermApplicationClaim, loadIntermApplicationContract, loadIntermApplicationPayment, loadIntermTotal, loadDAX, loadIntermTotalClaim, loadIntermPaymentrefApplication, loadIntermPaymentrefOrg, loadIntermPaymentrefAgreementDates, loadTotals, loadOrganisations, loadIntermAppCalcResultsDelinkPayment, loadIntermFinanceDAXDelinked, loadDelinkedCalculation, loadIntermTotalDelinked, loadD365, loadIntermApplicationClaimDelinked, loadIntermOrgDelinked, loadIntermCalcOrgDelinked } = require('./load-scripts')
const { deleteETLRecords } = require('./delete-etl-records')

const loadETLData = async (startDate) => {
  console.log(`Starting ETL data load at ${new Date().toISOString()}`)
  const transaction = await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })

  // Wrap each load function with logging
  const wrapWithLogging = (fn, name) => async () => {
    console.log(`Starting ${name} at ${new Date().toISOString()}`)
    try {
      const result = await fn(startDate)
      console.log(`Completed ${name} at ${new Date().toISOString()}`)
      return result
    } catch (error) {
      console.error(`Error in ${name}: ${error.message}`)
      throw error
    }
  }

  const promisesBatch1 = [
    wrapWithLogging(loadIntermFinanceDAX, 'loadIntermFinanceDAX')(),
    wrapWithLogging(loadIntermFinanceDAXDelinked, 'loadIntermFinanceDAXDelinked')(),
    wrapWithLogging(loadIntermOrg, 'loadIntermOrg')(),
    wrapWithLogging(loadIntermCalcOrgDelinked, 'loadIntermCalcOrgDelinked')(),
    wrapWithLogging(loadIntermOrgDelinked, 'loadIntermOrgDelinked')(),
    wrapWithLogging(loadIntermApplicationClaim, 'loadIntermApplicationClaim')(),
    wrapWithLogging(loadIntermApplicationClaimDelinked, 'loadIntermApplicationClaimDelinked')(),
    wrapWithLogging(loadIntermApplicationContract, 'loadIntermApplicationContract')(),
    wrapWithLogging(loadIntermApplicationPayment, 'loadIntermApplicationPayment')()
  ]

  const promisesBatch2 = [
    wrapWithLogging(loadIntermCalcOrg, 'loadIntermCalcOrg')(),
    wrapWithLogging(loadIntermTotal, 'loadIntermTotal')(),
    wrapWithLogging(loadIntermTotalDelinked, 'loadIntermTotalDelinked')(),
    wrapWithLogging(loadOrganisations, 'loadOrganisations')(startDate, transaction),
    wrapWithLogging(loadIntermPaymentrefAgreementDates, 'loadIntermPaymentrefAgreementDates')(startDate)
  ]

  const promisesBatch3 = [
    wrapWithLogging(loadDAX, 'loadDAX')(startDate, transaction),
    wrapWithLogging(loadIntermAppCalcResultsDelinkPayment, 'loadIntermAppCalcResultsDelinkPayment')(),
    wrapWithLogging(loadIntermTotalClaim, 'loadIntermTotalClaim')(),
    wrapWithLogging(loadIntermPaymentrefApplication, 'loadIntermPaymentrefApplication')(startDate)
  ]

  try {
    console.log(`Starting batch 1 with ${promisesBatch1.length} promises at ${new Date().toISOString()}`)
    await Promise.all(promisesBatch1)
    console.log(`Completed batch 1 at ${new Date().toISOString()}`)

    console.log(`Starting batch 2 with ${promisesBatch2.length} promises at ${new Date().toISOString()}`)
    await Promise.all(promisesBatch2)
    console.log(`Completed batch 2 at ${new Date().toISOString()}`)

    console.log(`Starting batch 3 with ${promisesBatch3.length} promises at ${new Date().toISOString()}`)
    await Promise.all(promisesBatch3)
    console.log(`Completed batch 3 at ${new Date().toISOString()}`)

    console.log(`Starting loadIntermPaymentrefOrg at ${new Date().toISOString()}`)
    await loadIntermPaymentrefOrg(startDate)
    console.log(`Completed loadIntermPaymentrefOrg at ${new Date().toISOString()}`)

    console.log(`Starting loadTotals at ${new Date().toISOString()}`)
    await loadTotals(startDate, transaction)
    console.log(`Completed loadTotals at ${new Date().toISOString()}`)

    console.log(`Starting loadDelinkedCalculation at ${new Date().toISOString()}`)
    await loadDelinkedCalculation(startDate, transaction)
    console.log(`Completed loadDelinkedCalculation at ${new Date().toISOString()}`)

    console.log(`Starting loadD365 at ${new Date().toISOString()}`)
    await loadD365(startDate, transaction)
    console.log(`Completed loadD365 at ${new Date().toISOString()}`)

    await transaction.commit()
    console.log(`ETL data successfully loaded at ${new Date().toISOString()}`)
  } catch (error) {
    console.error(`Error loading ETL data: ${error.message} at ${new Date().toISOString()}`)
    await deleteETLRecords(startDate)
    await transaction.rollback()
    throw error
  }
}

module.exports = {
  loadETLData
}
