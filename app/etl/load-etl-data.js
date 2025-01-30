const { Transaction } = require('sequelize')
const db = require('../data')
const { loadIntermFinanceDAX, loadIntermCalcOrg, loadIntermOrg, loadIntermApplicationClaim, loadIntermApplicationContract, loadIntermApplicationPayment, loadIntermTotal, loadDAX, loadIntermTotalClaim, loadIntermPaymentrefApplication, loadIntermPaymentrefOrg, loadIntermPaymentrefAgreementDates, loadTotals, loadOrganisations } = require('./load-scripts')

let functionsProcessed = 0

const loadETLData = async (startDate) => {
  const transaction = await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })
  try {
    await loadIntermFinanceDAX(startDate, transaction)
    functionsProcessed++
    await loadIntermCalcOrg(startDate, transaction)
    functionsProcessed++
    await loadIntermOrg(startDate, transaction)
    functionsProcessed++
    await loadIntermApplicationClaim(startDate, transaction)
    functionsProcessed++
    await loadIntermApplicationContract(startDate, transaction)
    functionsProcessed++
    await loadIntermApplicationPayment(startDate, transaction)
    functionsProcessed++
    await loadIntermTotal(startDate, transaction)
    functionsProcessed++
    await loadDAX(startDate, transaction)
    functionsProcessed++
    await loadIntermTotalClaim(startDate, transaction)
    functionsProcessed++
    await loadIntermPaymentrefApplication(startDate, transaction)
    functionsProcessed++
    await loadIntermPaymentrefOrg(startDate, transaction)
    functionsProcessed++
    await loadIntermPaymentrefAgreementDates(startDate, transaction)
    functionsProcessed++
    await loadTotals(startDate, transaction)
    functionsProcessed++
    await loadOrganisations(startDate, transaction)
    functionsProcessed++
    await transaction.commit()
    console.log('ETL data successfully loaded')
  } catch (error) {
    console.error('Error loading ETL data', error)
    console.log('Functions processed:', functionsProcessed)
    await transaction.rollback()
    throw error
  }
}

module.exports = {
  loadETLData
}
