const Joi = require('joi')
const {
  applicationDetailFolder, appsPaymentNotificationFolder, appsTypesFolder, businessAddressFolder, calculationsDetailsFolder, cssContractApplicationsFolder, cssContractFolder, cssOptionsFolder, defraLinksFolder, financeDAXFolder, organisationFolder, tclcOptionFolder, tclcFolder,
  applicationDetailDelinkedFolder, appsPaymentNotificationDelinkedFolder, appsTypesDelinkedFolder, businessAddressDelinkedFolder, calculationsDetailsDelinkedFolder, cssContractApplicationsDelinkedFolder, cssContractDelinkedFolder, cssOptionsDelinkedFolder, defraLinksDelinkedFolder, financeDAXDelinkedFolder, organisationDelinkedFolder, tclcOptionDelinkedFolder, tclcDelinkedFolder,
  appCalculationResultsDelinkPaymentsFolder, tdeLinkingTransferTransactionsFolder
} = require('../constants/folders')

const schema = Joi.object({
  checkCompleteTimeoutMs: Joi.number().required(),
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  container: Joi.string().required(),
  dwhExtractsFolder: Joi.string().required(),
  etlLogsFolder: Joi.string().required(),
  etlBatchSize: Joi.number().default(20000),
  applicationDetail: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  appsPaymentNotification: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  appsTypes: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  businessAddress: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  calculationsDetails: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  cssContractApplications: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  cssContract: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  cssOptions: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  defraLinks: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  financeDAX: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  organisation: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  tclcOption: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  tclc: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  applicationDetailDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  appsPaymentNotificationDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  appsTypesDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  businessAddressDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  calculationsDetailsDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  cssContractApplicationsDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  cssContractDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  cssOptionsDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  defraLinksDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  financeDAXDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  organisationDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  tclcOptionDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  tclcDelinked: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  appCalculationResultsDelinkPayments: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  tdeLinkingTransferTransactions: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  useConnectionStr: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(false)
})

const config = {
  checkCompleteTimeoutMs: 5000,
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  container: 'etl',
  dwhExtractsFolder: 'dwh_extracts',
  etlLogsFolder: 'logs',
  etlBatchSize: 100000,
  applicationDetail: {
    folder: applicationDetailFolder,
    fileMask: 'SFI23_STMT_APPLICATION_DETAILS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  appsPaymentNotification: {
    folder: appsPaymentNotificationFolder,
    fileMask: 'SFI23_STMT_APPS_PAYMENT_NOTIFICATIONS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  appsTypes: {
    folder: appsTypesFolder,
    fileMask: 'SFI23_STMT_APPS_TYPES_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  businessAddress: {
    folder: businessAddressFolder,
    fileMask: 'SFI23_STMT_BUSINESS_ADDRESS_CONTACT_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  calculationsDetails: {
    folder: calculationsDetailsFolder,
    fileMask: 'SFI23_STMT_CALCULATION_DETAILS_MV_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssContractApplications: {
    folder: cssContractApplicationsFolder,
    fileMask: 'SFI23_STMT_CSS_CONTRACT_APPLICATIONS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssContract: {
    folder: cssContractFolder,
    fileMask: 'SFI23_STMT_CSS_CONTRACTS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssOptions: {
    folder: cssOptionsFolder,
    fileMask: 'SFI23_STMT_CSS_OPTIONS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  defraLinks: {
    folder: defraLinksFolder,
    fileMask: 'SFI23_STMT_DEFRA_LINKS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  financeDAX: {
    folder: financeDAXFolder,
    fileMask: 'SFI23_STMT_FINANCE_DAX_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  organisation: {
    folder: organisationFolder,
    fileMask: 'SFI23_STMT_ORGANISATION_SFI_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  tclcOption: {
    folder: tclcOptionFolder,
    fileMask: 'SFI23_STMT_TCLC_PII_PAY_CLAIM_SFIMT_OPTION_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  tclc: {
    folder: tclcFolder,
    fileMask: 'SFI23_STMT_TCLC_PII_PAY_CLAIM_SFIMT_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  applicationDetailDelinked: {
    folder: applicationDetailDelinkedFolder,
    fileMask: 'DELINKED_STMT_APPLICATION_DETAILS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  appsPaymentNotificationDelinked: {
    folder: appsPaymentNotificationDelinkedFolder,
    fileMask: 'DELINKED_STMT_APPS_PAYMENT_NOTIFICATIONS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  appsTypesDelinked: {
    folder: appsTypesDelinkedFolder,
    fileMask: 'DELINKED_STMT_APPS_TYPES_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  businessAddressDelinked: {
    folder: businessAddressDelinkedFolder,
    fileMask: 'DELINKED_STMT_BUSINESS_ADDRESS_CONTACT_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  calculationsDetailsDelinked: {
    folder: calculationsDetailsDelinkedFolder,
    fileMask: 'DELINKED_STMT_CALCULATION_DETAILS_MV_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssContractApplicationsDelinked: {
    folder: cssContractApplicationsDelinkedFolder,
    fileMask: 'DELINKED_STMT_CSS_CONTRACT_APPLICATIONS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssContractDelinked: {
    folder: cssContractDelinkedFolder,
    fileMask: 'DELINKED_STMT_CSS_CONTRACTS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssOptionsDelinked: {
    folder: cssOptionsDelinkedFolder,
    fileMask: 'DELINKED_STMT_CSS_OPTIONS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  defraLinksDelinked: {
    folder: defraLinksDelinkedFolder,
    fileMask: 'DELINKED_STMT_DEFRA_LINKS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  financeDAXDelinked: {
    folder: financeDAXDelinkedFolder,
    fileMask: 'DELINKED_STMT_FINANCE_DAX_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  organisationDelinked: {
    folder: organisationDelinkedFolder,
    fileMask: 'DELINKED_STMT_ORGANISATION_SFI_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  tclcOptionDelinked: {
    folder: tclcOptionDelinkedFolder,
    fileMask: 'DELINKED_STMT_TCLC_PII_PAY_CLAIM_SFIMT_OPTION_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  tclcDelinked: {
    folder: tclcDelinkedFolder,
    fileMask: 'DELINKED_STMT_TCLC_PII_PAY_CLAIM_SFIMT_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  appCalculationResultsDelinkPayments: {
    folder: appCalculationResultsDelinkPaymentsFolder,
    fileMask: 'DELINKED_STMT_APPLICATION_CALC_RESULTS_DELINKPAYMENTS(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  tdeLinkingTransferTransactions: {
    folder: tdeLinkingTransferTransactionsFolder,
    fileMask: 'DELINKED_STMT_TDELINKING_TRANSFER_TRANSACTIONS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  useConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
