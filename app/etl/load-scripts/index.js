const { loadIntermApplicationClaim } = require('./load-interm-application-claim')
const { loadIntermApplicationContract } = require('./load-interm-application-contract')
const { loadIntermApplicationPayment } = require('./load-interm-application-payment')
const { loadIntermCalcOrg } = require('./load-interm-calc-org')
const { loadIntermFinanceDAX } = require('./load-interm-finance-dax')
const { loadIntermOrg } = require('./load-interm-org')
const { loadIntermPaymentrefAgreementDates } = require('./load-interm-paymentref-agreement-dates')
const { loadIntermPaymentrefApplication } = require('./load-interm-paymentref-application')
const { loadIntermPaymentrefOrg } = require('./load-interm-paymentref-org')
const { loadIntermTotal } = require('./load-interm-total')
const { loadIntermTotalClaim } = require('./load-interm-total-claim')
const { loadOrganisations } = require('./load-organisations')
const { loadIntermAppCalcResultsDelinkPayment } = require('./load-interm-app-calc-results-delink-payment')
const { loadDelinkedCalculation } = require('./load-delinked-calculation')
const { loadD365 } = require('./load-d365')
const { loadIntermTotalZeroValues } = require('./load-interm-total-zero-values')
const { loadZeroValueD365 } = require('./load-zero-value-d365')

module.exports = {
  loadIntermFinanceDAX,
  loadIntermCalcOrg,
  loadIntermOrg,
  loadIntermApplicationClaim,
  loadIntermApplicationContract,
  loadIntermApplicationPayment,
  loadIntermTotal,
  loadIntermAppCalcResultsDelinkPayment,
  loadIntermTotalClaim,
  loadIntermPaymentrefApplication,
  loadIntermPaymentrefOrg,
  loadIntermPaymentrefAgreementDates,
  loadOrganisations,
  loadDelinkedCalculation,
  loadD365,
  loadIntermTotalZeroValues,
  loadZeroValueD365
}
