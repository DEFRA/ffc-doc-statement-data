const Joi = require('joi')
const {
  applicationDetailDelinked, appsPaymentNotificationDelinked, appsTypesDelinked, businessAddressDelinked, calculationsDetailsDelinked, cssContractApplicationsDelinked, cssContractDelinked, cssOptionsDelinked, defraLinksDelinked, financeDAXDelinked, organisationDelinked, tclcOptionDelinked, tclcDelinked,
  appCalculationResultsDelinkPayments, tdeLinkingTransferTransactions,
  day0Organisation,
  day0BusinessAddress
} = require('../constants/folders')

const stringToBoolean = (value) => value === 'true' || value === true

const schema = Joi.object({
  checkCompleteTimeoutMs: Joi.number().required(),
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  useNewDWHContainer: Joi.boolean().required().default(true),
  dwhContainer: Joi.string().required(),
  etlExtractsFolder: Joi.string().required(),
  etlLogsFolder: Joi.string().required(),
  quarantineFolder: Joi.string().default('quarantine'),
  dataRetentionFolder: Joi.string().required(),
  etlBatchSize: Joi.number().default(2000),
  excludeCalculationData: Joi.boolean().default(true),
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
  day0Organisation: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  day0BusinessAddress: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  useConnectionStr: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(false),
  managedIdentityClientId: Joi.string().optional(),
  delinkedEnabled: Joi.boolean().default(true),
  fakeData: Joi.boolean().default(true)
})

const config = {
  checkCompleteTimeoutMs: 5000,
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  useNewDWHContainer: stringToBoolean(process.env.USE_NEW_DWH_CONTAINER),
  dwhContainer: stringToBoolean(process.env.USE_NEW_DWH_CONTAINER) ? 'dwh' : 'etl',
  etlExtractsFolder: stringToBoolean(process.env.USE_NEW_DWH_CONTAINER) ? 'delinked-payment_statements' : 'dwh_extracts',
  etlLogsFolder: 'logs',
  quarantineFolder: 'quarantine',
  dataRetentionFolder: 'data_retention',
  etlBatchSize: 4000,
  excludeCalculationData: process.env.EXCLUDE_CALCULATION_DATA,
  applicationDetailDelinked: {
    folder: applicationDetailDelinked,
    fileMask: 'DELINKED_STMT_APPLICATION_DETAILS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  appsPaymentNotificationDelinked: {
    folder: appsPaymentNotificationDelinked,
    fileMask: 'DELINKED_STMT_APPS_PAYMENT_NOTIFICATIONS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  appsTypesDelinked: {
    folder: appsTypesDelinked,
    fileMask: 'DELINKED_STMT_APPS_TYPES_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  businessAddressDelinked: {
    folder: businessAddressDelinked,
    fileMask: 'DELINKED_STMT_BUSINESS_ADDRESS_CONTACT_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  calculationsDetailsDelinked: {
    folder: calculationsDetailsDelinked,
    fileMask: 'DELINKED_STMT_CALCULATION_DETAILS_MV_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssContractApplicationsDelinked: {
    folder: cssContractApplicationsDelinked,
    fileMask: 'DELINKED_STMT_CSS_CONTRACT_APPLICATIONS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssContractDelinked: {
    folder: cssContractDelinked,
    fileMask: 'DELINKED_STMT_CSS_CONTRACTS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssOptionsDelinked: {
    folder: cssOptionsDelinked,
    fileMask: 'DELINKED_STMT_CSS_OPTIONS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  defraLinksDelinked: {
    folder: defraLinksDelinked,
    fileMask: 'DELINKED_STMT_DEFRA_LINKS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  financeDAXDelinked: {
    folder: financeDAXDelinked,
    fileMask: 'DELINKED_STMT_FINANCE_DAX_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  organisationDelinked: {
    folder: organisationDelinked,
    fileMask: 'DELINKED_STMT_ORGANISATION_SFI_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  tclcOptionDelinked: {
    folder: tclcOptionDelinked,
    fileMask: 'DELINKED_STMT_TCLC_PII_PAY_CLAIM_SFIMT_OPTION_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  tclcDelinked: {
    folder: tclcDelinked,
    fileMask: 'DELINKED_STMT_TCLC_PII_PAY_CLAIM_SFIMT_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  appCalculationResultsDelinkPayments: {
    folder: appCalculationResultsDelinkPayments,
    fileMask: 'DELINKED_STMT_APPLICATION_CALC_RESULTS_DELINKPAYMENTS(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  tdeLinkingTransferTransactions: {
    folder: tdeLinkingTransferTransactions,
    fileMask: 'DELINKED_STMT_TDELINKING_TRANSFER_TRANSACTIONS_V(_CHANGE_LOG)?_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  day0Organisation: {
    folder: day0Organisation,
    fileMask: 'DAY0_ORGANISATION_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  day0BusinessAddress: {
    folder: day0BusinessAddress,
    fileMask: 'DAY0_BUSINESS_ADDRESS_CONTACT_V_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  useConnectionStr: stringToBoolean(process.env.AZURE_STORAGE_USE_CONNECTION_STRING),
  createContainers: stringToBoolean(process.env.AZURE_STORAGE_CREATE_CONTAINERS),
  managedIdentityClientId: process.env.AZURE_CLIENT_ID,
  delinkedEnabled: stringToBoolean(process.env.DELINKED_ENABLED),
  fakeData: stringToBoolean(process.env.FAKE_DATA)
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
