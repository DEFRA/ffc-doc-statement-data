const db = require('../../app/data')

const tables = [
  'actions',
  'd365',
  'dax',
  'delinkedCalculation',
  'etlIntermAppCalcResultsDelinkPayments',
  'etlIntermApplicationClaim',
  'etlIntermApplicationContract',
  'etlIntermApplicationPayment',
  'etlIntermCalcOrg',
  'etlIntermFinanceDax',
  'etlIntermOrg',
  'etlIntermPaymentrefAgreementDates',
  'etlIntermPaymentrefApplication',
  'etlIntermPaymentrefOrg',
  'etlIntermTotal',
  'etlIntermTotalClaim',
  'etlIntermTotalZeroValues',
  'etlStageAppCalcResultsDelinkPayments',
  'etlStageApplicationDetail',
  'etlStageAppsPaymentNotification',
  'etlStageAppsTypes',
  'etlStageBusinessAddressContactV',
  'etlStageCalculationDetails',
  'etlStageCssContractApplications',
  'etlStageCssContracts',
  'etlStageCssOptions',
  'etlStageDefraLinks',
  'etlStageFinanceDax',
  'etlStageLog',
  'etlStageOrganisation',
  'etlStageTclcPiiPayClaimSfimtOption',
  'etlStageTdeLinkingTransferTransactions',
  'organisations',
  'subsetCheck',
  'totals',
  'zeroValueD365'
]

const truncate = async () => {
  const quoted = tables.map(table => `"${table}"`).join(', ')
  await db.client.raw(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`)
}

module.exports = {
  truncate
}
