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

  try {
    await wrapWithLogging(loadIntermFinanceDAX, 'loadIntermFinanceDAX')()
    await wrapWithLogging(loadIntermFinanceDAXDelinked, 'loadIntermFinanceDAXDelinked')()
    await wrapWithLogging(loadIntermOrg, 'loadIntermOrg')()
    await wrapWithLogging(loadIntermOrgDelinked, 'loadIntermOrgDelinked')()
    await wrapWithLogging(loadIntermApplicationClaim, 'loadIntermApplicationClaim')()
    await wrapWithLogging(loadIntermApplicationClaimDelinked, 'loadIntermApplicationClaimDelinked')()
    await wrapWithLogging(loadIntermApplicationContract, 'loadIntermApplicationContract')()
    await wrapWithLogging(loadIntermApplicationPayment, 'loadIntermApplicationPayment')()

    await wrapWithLogging(loadIntermCalcOrg, 'loadIntermCalcOrg')()
    await wrapWithLogging(loadIntermCalcOrgDelinked, 'loadIntermCalcOrgDelinked')()
    await wrapWithLogging(loadIntermTotal, 'loadIntermTotal')()
    await wrapWithLogging(loadIntermTotalDelinked, 'loadIntermTotalDelinked')()
    await wrapWithLogging(loadOrganisations, 'loadOrganisations')()
    await wrapWithLogging(loadIntermPaymentrefAgreementDates, 'loadIntermPaymentrefAgreementDates')()

    await wrapWithLogging(loadDAX, 'loadDAX')()
    await wrapWithLogging(loadIntermAppCalcResultsDelinkPayment, 'loadIntermAppCalcResultsDelinkPayment')()
    await wrapWithLogging(loadIntermTotalClaim, 'loadIntermTotalClaim')()
    await wrapWithLogging(loadIntermPaymentrefApplication, 'loadIntermPaymentrefApplication')()

    await wrapWithLogging(loadIntermPaymentrefOrg, 'loadIntermPaymentrefOrg')()
    await wrapWithLogging(loadTotals, 'loadTotals')()
    await wrapWithLogging(loadDelinkedCalculation, 'loadDelinkedCalculation')()
    await wrapWithLogging(loadD365, 'loadD365')()

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
