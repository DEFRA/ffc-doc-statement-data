const { Transaction } = require('sequelize')
const db = require('../data')
const { loadIntermFinanceDAX, loadIntermCalcOrg, loadIntermOrg, loadIntermApplicationClaim, loadIntermApplicationContract, loadIntermApplicationPayment, loadIntermTotal, loadDAX, loadIntermTotalClaim, loadIntermPaymentrefApplication, loadIntermPaymentrefOrg, loadIntermPaymentrefAgreementDates, loadTotals, loadOrganisations } = require('./load-scripts')

const loadETLData = async (startDate) => {
  // This is written as a raw query for performance reasons
  const transaction = await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })
  try {
    await loadIntermFinanceDAX(startDate, transaction)
    await loadIntermCalcOrg(startDate, transaction)
    await loadIntermOrg(startDate, transaction)
    await loadIntermApplicationClaim(startDate, transaction)
    await loadIntermApplicationContract(startDate, transaction)
    await loadIntermApplicationPayment(startDate, transaction)
    await loadIntermTotal(startDate, transaction)
    await loadDAX(startDate, transaction)
    await loadIntermTotalClaim(startDate, transaction)
    await loadIntermPaymentrefApplication(startDate, transaction)
    await loadIntermPaymentrefOrg(startDate, transaction)
    await loadIntermPaymentrefAgreementDates(startDate, transaction)
    await loadTotals(startDate, transaction)
    await loadOrganisations(startDate, transaction)
    await transaction.commit()
    console.log('ETL data successfully loaded')
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = {
  loadETLData
}
