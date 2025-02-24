const { stageApplicationDetails, stageApplicationDetailsDelinked } = require('./stage-application-detail')
const { stageAppsPaymentNotifications, stageAppsPaymentNotificationsDelinked } = require('./stage-apps-payment-notification')
const { stageAppsTypes, stageAppsTypesDelinked } = require('./stage-apps-types')
const { stageBusinessAddressContacts, stageBusinessAddressContactsDelinked } = require('./stage-business-address-contact')
const { stageCalculationDetails, stageCalculationDetailsDelinked } = require('./stage-calculations-details')
const { stageCSSContract, stageCSSContractDelinked } = require('./stage-css-contract')
const { stageCSSContractApplications, stageCSSContractApplicationsDelinked } = require('./stage-css-contract-applications')
const { stageCSSOptions, stageCSSOptionsDelinked } = require('./stage-css-options')
const { stageDefraLinks, stageDefraLinksDelinked } = require('./stage-defra-links')
const { stageFinanceDAX, stageFinanceDAXDelinked } = require('./stage-finance-dax')
const { stageOrganisation, stageOrganisationDelinked } = require('./stage-organisation')
const { stageTCLCOption, stageTCLCOptionDelinked } = require('./stage-tclc-option')
const { stageTdeLinkingTransferTransactions } = require('./stage-tde-linking-transfer-transactions')
const { stageAppCalcResultsDelinkPayments } = require('./stage-app-calc-results-delink-payments')

module.exports = {
  stageApplicationDetails,
  stageAppsPaymentNotifications,
  stageAppsTypes,
  stageBusinessAddressContacts,
  stageCalculationDetails,
  stageCSSContractApplications,
  stageCSSContract,
  stageCSSOptions,
  stageDefraLinks,
  stageFinanceDAX,
  stageOrganisation,
  stageTCLCOption,
  stageApplicationDetailsDelinked,
  stageAppsPaymentNotificationsDelinked,
  stageAppsTypesDelinked,
  stageBusinessAddressContactsDelinked,
  stageCalculationDetailsDelinked,
  stageCSSContractDelinked,
  stageCSSContractApplicationsDelinked,
  stageCSSOptionsDelinked,
  stageDefraLinksDelinked,
  stageFinanceDAXDelinked,
  stageOrganisationDelinked,
  stageTCLCOptionDelinked,
  stageTdeLinkingTransferTransactions,
  stageAppCalcResultsDelinkPayments
}
