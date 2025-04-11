const { Transaction } = require('sequelize')
const db = require('../data')
const { loadIntermFinanceDAX, loadIntermCalcOrg, loadIntermOrg, loadIntermApplicationClaim, loadIntermApplicationContract, loadIntermApplicationPayment, loadIntermTotal, loadDAX, loadIntermTotalClaim, loadIntermPaymentrefApplication, loadIntermPaymentrefOrg, loadIntermPaymentrefAgreementDates, loadTotals, loadOrganisations, loadIntermAppCalcResultsDelinkPayment, loadIntermFinanceDAXDelinked, loadDelinkedCalculation, loadIntermTotalDelinked, loadD365, loadIntermApplicationClaimDelinked, loadIntermOrgDelinked, loadIntermCalcOrgDelinked } = require('./load-scripts')
const { deleteETLRecords } = require('./delete-etl-records')

const loadETLData = async (startDate) => {
  const transaction = await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })

  const promisesBatch1 = [
    loadIntermFinanceDAX(startDate),
    loadIntermFinanceDAXDelinked(startDate),
    loadIntermOrg(startDate),
    loadIntermCalcOrgDelinked(startDate),
    loadIntermOrgDelinked(startDate),
    loadIntermApplicationClaim(startDate),
    loadIntermApplicationClaimDelinked(startDate),
    loadIntermApplicationContract(startDate),
    loadIntermApplicationPayment(startDate)
  ]

  const promisesBatch2 = [
    loadIntermCalcOrg(startDate),
    loadIntermTotal(startDate),
    loadIntermTotalDelinked(startDate),
    loadOrganisations(startDate, transaction),
    loadIntermPaymentrefAgreementDates(startDate)
  ]

  const promisesBatch3 = [
    loadDAX(startDate, transaction),
    loadIntermAppCalcResultsDelinkPayment(startDate),
    loadIntermTotalClaim(startDate),
    loadIntermPaymentrefApplication(startDate)
  ]

  try {
    await Promise.all(promisesBatch1)
    await Promise.all(promisesBatch2)
    await Promise.all(promisesBatch3)
    await loadIntermPaymentrefOrg(startDate)
    await loadTotals(startDate, transaction)
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
