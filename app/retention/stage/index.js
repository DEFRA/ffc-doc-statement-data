const { findSbisWithNoOtherCalculations } = require('./find-sbis-with-no-other-calculations')
const { findStageAppDetails } = require('./find-stage-app-details')
const { findStageCssContractApps } = require('./find-stage-css-contract-apps')
const { removeEtlStageAppCalcResultsDelinkPayments } = require('./remove-etl-stage-app-calc-results-delink-payments')
const { removeEtlStageApplicationDetail } = require('./remove-etl-stage-application-detail')
const { removeEtlStageAppsPaymentNotification } = require('./remove-etl-stage-apps-payment-notification')
const { removeEtlStageBusinessAddressContactV } = require('./remove-etl-stage-business-address-contact-v')
const { removeEtlStageCalculationDetails } = require('./remove-etl-stage-calculation-details')
const { removeEtlStageCssContractApplications } = require('./remove-etl-stage-css-contract-applications')
const { removeEtlStageCssContracts } = require('./remove-etl-stage-css-contracts')
const { removeEtlStageDefraLinks } = require('./remove-etl-stage-defra-links')
const { removeEtlStageFinanceDax } = require('./remove-etl-stage-finance-dax')
const { removeEtlStageOrganisation } = require('./remove-etl-stage-organisation')
const { removeEtlStageTclcPiiPayClaimSfimtOption } = require('./remove-etl-stage-tclc-pii-pay-claim-sfimt-option')

module.exports = {
  findSbisWithNoOtherCalculations,
  findStageAppDetails,
  findStageCssContractApps,
  removeEtlStageAppCalcResultsDelinkPayments,
  removeEtlStageApplicationDetail,
  removeEtlStageAppsPaymentNotification,
  removeEtlStageBusinessAddressContactV,
  removeEtlStageCalculationDetails,
  removeEtlStageCssContractApplications,
  removeEtlStageCssContracts,
  removeEtlStageDefraLinks,
  removeEtlStageFinanceDax,
  removeEtlStageOrganisation,
  removeEtlStageTclcPiiPayClaimSfimtOption
}
