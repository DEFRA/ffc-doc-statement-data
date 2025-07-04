const { loadDAX } = require('./load-dax')
const { loadIntermApplicationClaim, loadIntermApplicationClaimDelinked } = require('./load-interm-application-claim')
const { loadIntermApplicationContract } = require('./load-interm-application-contract')
const { loadIntermApplicationPayment } = require('./load-interm-application-payment')
const { loadIntermCalcOrg, loadIntermCalcOrgDelinked } = require('./load-interm-calc-org')
const { loadIntermFinanceDAX, loadIntermFinanceDAXDelinked } = require('./load-interm-finance-dax')
const { loadIntermOrg, loadIntermOrgDelinked } = require('./load-interm-org')
const { loadIntermPaymentrefAgreementDates } = require('./load-interm-paymentref-agreement-dates')
const { loadIntermPaymentrefApplication } = require('./load-interm-paymentref-application')
const { loadIntermPaymentrefOrg } = require('./load-interm-paymentref-org')
const { loadIntermTotal, loadIntermTotalDelinked } = require('./load-interm-total')
const { loadIntermTotalClaim } = require('./load-interm-total-claim')
const { loadOrganisations } = require('./load-organisations')
const { loadTotals } = require('./load-totals')
const { loadIntermAppCalcResultsDelinkPayment } = require('./load-interm-app-calc-results-delink-payment')
const { loadDelinkedCalculation } = require('./load-delinked-calculation')
const { loadD365 } = require('./load-d365')
const { loadIntermTotalZeroValues, loadIntermTotalZeroValuesDelinked } = require('./load-interm-total-zero-values')
const { loadZeroTotals } = require('./load-zero-totals')

module.exports = {
  loadIntermFinanceDAX,
  loadIntermFinanceDAXDelinked,
  loadIntermCalcOrg,
  loadIntermCalcOrgDelinked,
  loadIntermOrg,
  loadIntermOrgDelinked,
  loadIntermApplicationClaim,
  loadIntermApplicationClaimDelinked,
  loadIntermApplicationContract,
  loadIntermApplicationPayment,
  loadIntermTotal,
  loadIntermTotalDelinked,
  loadDAX,
  loadIntermAppCalcResultsDelinkPayment,
  loadIntermTotalClaim,
  loadIntermPaymentrefApplication,
  loadIntermPaymentrefOrg,
  loadIntermPaymentrefAgreementDates,
  loadTotals,
  loadOrganisations,
  loadDelinkedCalculation,
  loadD365,
  loadIntermTotalZeroValues,
  loadIntermTotalZeroValuesDelinked,
  loadZeroTotals
}
