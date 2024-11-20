const { loadDAX } = require('./load-dax')
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
const { loadTotals } = require('./load-totals')

module.exports = {
  loadIntermFinanceDAX,
  loadIntermCalcOrg,
  loadIntermOrg,
  loadIntermApplicationClaim,
  loadIntermApplicationContract,
  loadIntermApplicationPayment,
  loadIntermTotal,
  loadDAX,
  loadIntermTotalClaim,
  loadIntermPaymentrefApplication,
  loadIntermPaymentrefOrg,
  loadIntermPaymentrefAgreementDates,
  loadTotals,
  loadOrganisations
}
