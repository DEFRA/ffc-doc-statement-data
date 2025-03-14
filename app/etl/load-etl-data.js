const { Transaction } = require('sequelize')
const db = require('../data')
const { loadIntermFinanceDAX, loadIntermCalcOrg, loadIntermOrg, loadIntermApplicationClaim, loadIntermApplicationContract, loadIntermApplicationPayment, loadIntermTotal, loadDAX, loadIntermTotalClaim, loadIntermPaymentrefApplication, loadIntermPaymentrefOrg, loadIntermPaymentrefAgreementDates, loadTotals, loadOrganisations } = require('./load-scripts')
const { deleteETLRecords } = require('./delete-etl-records')
const { clearTempTables, restoreIntermTablesFromTemp } = require('./manage-temp-tables')

const loadETLData = async (startDate) => {
  const transaction = await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })
  try {
    await loadIntermFinanceDAX(startDate)
    await loadIntermCalcOrg(startDate)
    await loadIntermOrg(startDate)
    await loadIntermApplicationClaim(startDate)
    await loadIntermApplicationContract(startDate)
    await loadIntermApplicationPayment(startDate)
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
    console.error('Error loading ETL data', error)
    await restoreIntermTablesFromTemp()
    await deleteETLRecords(startDate)
    await transaction.rollback()
    throw error
  } finally {
    await clearTempTables()
  }
}

module.exports = {
  loadETLData
}
