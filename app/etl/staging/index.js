const { stageApplicationDetails } = require('./stage-application-detail')
const { stageAppsPaymentNotifications } = require('./stage-apps-payment-notification')
const { stageAppsTypes } = require('./stage-apps-types')
const { stageBusinessAddressContacts } = require('./stage-business-address-contact')
const { stageCalculationDetails } = require('./stage-calculations-details')
const { stageCSSContract } = require('./stage-css-contract')
const { stageCSSContractApplications } = require('./stage-css-contract-applications')
const { stageCSSOptions } = require('./stage-css-options')
const { stageDefraLinks } = require('./stage-defra-links')
const { stageFinanceDAX } = require('./stage-finance-dax')
const { stageOrganisation } = require('./stage-organisation')
const { stageTCLCOption } = require('./stage-tclc-option')

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
  stageTCLCOption
}
