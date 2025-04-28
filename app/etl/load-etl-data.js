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
  const wrapWithLogging = (fn, name) => async (_startDate = null, transaction = null) => {
    console.log(`Starting ${name} at ${new Date().toISOString()}`)
    try {
      const result = transaction ? await fn(startDate, transaction) : await fn(startDate)
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
    wrapWithLogging(loadIntermOrgDelinked, 'loadIntermOrgDelinked')(),
    wrapWithLogging(loadIntermApplicationClaim, 'loadIntermApplicationClaim')(),
    wrapWithLogging(loadIntermApplicationClaimDelinked, 'loadIntermApplicationClaimDelinked')(),
    wrapWithLogging(loadIntermApplicationContract, 'loadIntermApplicationContract')(),
    wrapWithLogging(loadIntermApplicationPayment, 'loadIntermApplicationPayment')()
  ]

  const promisesBatch2 = [
    wrapWithLogging(loadIntermCalcOrg, 'loadIntermCalcOrg')(),
    wrapWithLogging(loadIntermCalcOrgDelinked, 'loadIntermCalcOrgDelinked')(),
    wrapWithLogging(loadIntermTotal, 'loadIntermTotal')(),
    wrapWithLogging(loadIntermTotalDelinked, 'loadIntermTotalDelinked')(),
    wrapWithLogging(loadOrganisations, 'loadOrganisations')(),
    wrapWithLogging(loadIntermPaymentrefAgreementDates, 'loadIntermPaymentrefAgreementDates')()
  ]

  const promisesBatch3 = [
    wrapWithLogging(loadDAX, 'loadDAX')(),
    wrapWithLogging(loadIntermAppCalcResultsDelinkPayment, 'loadIntermAppCalcResultsDelinkPayment')(),
    wrapWithLogging(loadIntermTotalClaim, 'loadIntermTotalClaim')(),
    wrapWithLogging(loadIntermPaymentrefApplication, 'loadIntermPaymentrefApplication')()
  ]

  try {
    const batches = [promisesBatch1, promisesBatch2, promisesBatch3]
    
    for (const [index, batch] of batches.entries()) {
      console.log(`Starting batch ${index + 1} with ${batch.length} promises at ${new Date().toISOString()}`)
      await Promise.all(batch)
      console.log(`Completed batch ${index + 1} at ${new Date().toISOString()}`)
    }

    console.log(`Starting loadIntermPaymentrefOrg at ${new Date().toISOString()}`)
    await loadIntermPaymentrefOrg(startDate)
    console.log(`Completed loadIntermPaymentrefOrg at ${new Date().toISOString()}`)

    console.log(`Starting loadTotals at ${new Date().toISOString()}`)
    await loadTotals(startDate)
    console.log(`Completed loadTotals at ${new Date().toISOString()}`)

    console.log(`Starting loadDelinkedCalculation at ${new Date().toISOString()}`)
    await loadDelinkedCalculation(startDate)
    console.log(`Completed loadDelinkedCalculation at ${new Date().toISOString()}`)

    console.log(`Starting loadD365 at ${new Date().toISOString()}`)
    await loadD365(startDate)
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
