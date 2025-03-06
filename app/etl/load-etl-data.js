const { Transaction } = require('sequelize')
const db = require('../data')
const { loadIntermFinanceDAX, loadIntermCalcOrg, loadIntermOrg, loadIntermApplicationClaim, loadIntermApplicationContract, loadIntermApplicationPayment, loadIntermTotal, loadDAX, loadIntermTotalClaim, loadIntermPaymentrefApplication, loadIntermPaymentrefOrg, loadIntermPaymentrefAgreementDates, loadTotals, loadOrganisations, loadIntermAppCalcResultsDelinkPayment, loadIntermFinanceDAXDelinked, loadDelinkedCalculation, loadIntermTotalDelinked, loadD365, loadIntermApplicationClaimDelinked } = require('./load-scripts')
const { deleteETLRecords } = require('./delete-etl-records')

const loadETLData = async (startDate) => {
  const transaction = await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })
  try {
    await loadIntermFinanceDAX(startDate, transaction)
    await loadIntermFinanceDAXDelinked(startDate, transaction)
    await loadIntermCalcOrg(startDate, transaction)
    await loadIntermOrg(startDate, transaction)
    await loadIntermApplicationClaim(startDate, transaction)
    await loadIntermApplicationClaimDelinked(startDate, transaction)
    await loadIntermApplicationContract(startDate, transaction)
    await loadIntermApplicationPayment(startDate, transaction)
    await loadIntermTotal(startDate, transaction)
    await loadIntermTotalDelinked(startDate, transaction)
    await loadDAX(startDate, transaction)
    await loadIntermAppCalcResultsDelinkPayment(startDate, transaction)
    await loadIntermTotalClaim(startDate, transaction)
    await loadIntermPaymentrefApplication(startDate, transaction)
    await loadIntermPaymentrefOrg(startDate, transaction)
    await loadIntermPaymentrefAgreementDates(startDate, transaction)
    await loadTotals(startDate, transaction)
    await loadOrganisations(startDate, transaction)
    await loadDelinkedCalculation(startDate, transaction)
    await loadD365(startDate, transaction)
    await transaction.commit()
    console.log('ETL data successfully loaded')
  } catch (error) {
    console.error('Error loading ETL data', error)
    await deleteETLRecords(startDate)
    await transaction.rollback()
    throw error
  }
}

module.exports = {
  loadETLData
}
