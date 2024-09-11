const fs = require('fs')
const stage_application_details = require("./stage_application_detail")
const stage_apps_payment_notifications = require("./stage_apps_payment_notification")
const stage_apps_types = require("./stage_apps_types")
const stage_business_address_contacts = require("./stage_business_address_contact")
const stage_calculation_details = require("./stage_calculations_details")
const stage_css_contract_applications = require("./stage_css_contract_applications")
const stage_css_contract = require("./stage_css_contract")
const stage_css_options = require("./stage_css_options")
const stage_defra_links = require("./stage_defra_links")
const stage_finance_dax = require("./stage_finance_dax")
const stage_organisation = require("./stage_organisation")
const stage_tclc_pii_pay_claim_sfimt_option = require("./stage_tclc_pii_pay_claim_sfimt_option")
const stage_settlement = require("./stage_settlement")

let completed = 0
let total = 13

global.results = [];

(async () => {

  const pkg = await import("@topcli/spinner")
  const stageApplicationDetailsSpinner = new pkg.Spinner().start("Stage Application Details")
  const stageAppsTypesSpinner = new pkg.Spinner().start("Stage Application Types")
  const stageApplicationPaymentNotificationsSpinner = new pkg.Spinner().start("Stage Application Payment Notifications")
  const stageBusinessAddressContactsSpinner = new pkg.Spinner().start("Stage Business Address Contacts")
  const stageCalculationDetailsSpinner = new pkg.Spinner().start("Stage Calculation Details")
  const stageCSSContractApplicationsSpinner = new pkg.Spinner().start("Stage CSS Contract Applications")
  const stageCSSContractSpinner = new pkg.Spinner().start("Stage CSS Contract")
  const stageCSSContractOptionsSpinner = new pkg.Spinner().start("Stage CSS Contract Options")
  const stageDefraLinksSpinner = new pkg.Spinner().start("Stage Defra Links")
  const stageFinanceDaxSpinner = new pkg.Spinner().start("Stage Finance Dax")
  const stageOrganisationSpinner = new pkg.Spinner().start("Stage Organisation")
  const stageTclcPiiPayClaimSFIMTOptionSpinner = new pkg.Spinner().start("Stage tclc_pii_pay_claim_sfimt_option")
  const stageSettlementsSpinner = new pkg.Spinner().start("Stage Settlement")

  stage_application_details()
    .then(() => stageApplicationDetailsSpinner.succeed("Stage Application Details - staged"))
    .catch((e) => stageApplicationDetailsSpinner.failed(`Stage Application Details - ${e.message}`))
    .finally(() => completed += 1)

  stage_apps_types()
    .then(() => stageAppsTypesSpinner.succeed("Stage Application Types - staged"))
    .catch((e) => stageAppsTypesSpinner.failed(`Stage Application Types - ${e.message}`))
    .finally(() => completed += 1)

  stage_apps_payment_notifications()
    .then(() => stageApplicationPaymentNotificationsSpinner.succeed("Stage Application Payment Notifications - staged"))
    .catch((e) => stageApplicationPaymentNotificationsSpinner.failed(`Stage Application Payment Notifications - ${e.message}`))
    .finally(() => completed += 1)

  stage_business_address_contacts()
    .then(() => stageBusinessAddressContactsSpinner.succeed("Stage Business Address Contacts - staged"))
    .catch((e) => stageBusinessAddressContactsSpinner.failed(`Stage Business Address Contacts - ${e.message}`))
    .finally(() => completed += 1)

  stage_calculation_details()
    .then(() => stageCalculationDetailsSpinner.succeed("Stage Calculation Details - staged"))
    .catch((e) => stageCalculationDetailsSpinner.failed(`Stage Calculation Details - ${e.message}`))
    .finally(() => completed += 1)

  stage_css_contract_applications()
    .then(() => stageCSSContractApplicationsSpinner.succeed("Stage CSS Contract Applications - staged"))
    .catch((e) => stageCSSContractApplicationsSpinner.failed(`Stage CSS Contract Applications - ${e.message}`))
    .finally(() => completed += 1)

  stage_css_contract()
    .then(() => stageCSSContractSpinner.succeed("Stage CSS Contract - staged"))
    .catch((e) => stageCSSContractSpinner.failed(`Stage CSS Contract - ${e.message}`))
    .finally(() => completed += 1)

  stage_css_options()
    .then(() => stageCSSContractOptionsSpinner.succeed("Stage CSS Contract Options - staged"))
    .catch((e) => stageCSSContractOptionsSpinner.failed(`Stage CSS Contract Options - ${e.message}`))
    .finally(() => completed += 1)

  stage_defra_links()
    .then(() => stageDefraLinksSpinner.succeed("Stage Defra Links - staged"))
    .catch((e) => stageDefraLinksSpinner.failed(`Stage Defra Links - ${e.message}`))
    .finally(() => completed += 1)

  stage_finance_dax()
    .then(() => stageFinanceDaxSpinner.succeed("Stage Finance Dax - staged"))
    .catch((e) => stageFinanceDaxSpinner.failed(`Stage Finance Dax - ${e.message}`))
    .finally(() => completed += 1)

  stage_organisation()
    .then(() => stageOrganisationSpinner.succeed("Stage Organisation - staged"))
    .catch((e) => stageOrganisationSpinner.failed(`Stage Organisation - ${e.message}`))
    .finally(() => completed += 1)

  stage_tclc_pii_pay_claim_sfimt_option()
    .then(() => stageTclcPiiPayClaimSFIMTOptionSpinner.succeed("Stage tclc_pii_pay_claim_sfimt_option - staged"))
    .catch((e) => stageTclcPiiPayClaimSFIMTOptionSpinner.failed(`Stage tclc_pii_pay_claim_sfimt_option - ${e.message}`))
    .finally(() => completed += 1)

  stage_settlement()
    .then(() => stageSettlementsSpinner.succeed("Stage Settlement - staged"))
    .catch((e) => stageSettlementsSpinner.failed(`Stage Settlement - ${e.message}`))
    .finally(() => completed += 1)

})()

const checkComplete = () => {
  if (completed < total) {
    setTimeout(checkComplete, 5000)
  } else {
    fs.writeFileSync('result.log', JSON.stringify(global.results, null, 2))
  }
}

checkComplete()

// const {
//   Worker, isMainThread, parentPort, workerData,
// } = require('node:worker_threads')

// if (isMainThread) {

// }
