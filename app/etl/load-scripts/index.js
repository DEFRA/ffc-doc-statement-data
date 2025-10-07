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
const { loadIntermTotal } = require('./load-interm-total')
const { loadIntermTotalClaim } = require('./load-interm-total-claim')
const { loadOrganisations } = require('./load-organisations')
const { loadTotals } = require('./load-totals')
const { loadIntermAppCalcResultsDelinkPayment } = require('./load-interm-app-calc-results-delink-payment')
const { loadDelinkedCalculation } = require('./load-delinked-calculation')
const { loadD365 } = require('./load-d365')
const { loadIntermTotalZeroValues } = require('./load-interm-total-zero-values')
const { loadZeroValueD365 } = require('./load-zero-value-d365')
const { loadZeroValueDax } = require('./load-zero-value-dax')
const { loadIntermOrgFromDay0 } = require('./load-interm-org-from-day0')

module.exports = {
  loadIntermFinanceDAX,
  loadIntermFinanceDAXDelinked,
  loadIntermCalcOrg,
  loadIntermCalcOrgDelinked,
  loadIntermOrg,
  loadIntermOrgDelinked,
  loadIntermOrgFromDay0,
  loadIntermApplicationClaim,
  loadIntermApplicationClaimDelinked,
  loadIntermApplicationContract,
  loadIntermApplicationPayment,
  loadIntermTotal,
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
  loadZeroValueD365,
  loadZeroValueDax
}
