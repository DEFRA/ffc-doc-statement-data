const { stageApplicationDetails } = require('./stage-application-detail')
const { stageAppsPaymentNotifications } = require('./stage-apps-payment-notification')
const { stageAppsTypes } = require('./stage-apps-types')
const { stageBusinessAddressContacts } = require('./stage-business-address-contact')
const { stageCalculationDetails } = require('./stage-calculations-details')
const { stageCalcResultsDelinkPayments } = require('./stage-calc-results-delink-payments')
const { stageDefraLinks } = require('./stage-defra-links')
const { stageFinanceDAX } = require('./stage-finance-dax')
const { stageOrganisation } = require('./stage-organisation')
// const { stageTdeLinking } = require('./stage-tde-linking')

module.exports = {
  stageApplicationDetails,
  stageAppsPaymentNotifications,
  stageAppsTypes,
  stageBusinessAddressContacts,
  stageCalculationDetails,
  stageCalcResultsDelinkPayments,
  stageDefraLinks,
  stageFinanceDAX,
  stageOrganisation
}
