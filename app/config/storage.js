const Joi = require('joi')
const { applicationDetail, appsPaymentNotification, appsTypes, businessAddress, calculationsDetails, cssContractApplications, cssContract, cssOptions, defraLinks, financeDAX, organisation, tclcOption, tclc } = require('../constants/folders')

const schema = Joi.object({
  checkCompleteTimeoutMs: Joi.number().required(),
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  container: Joi.string().required(),
  dwhExtractsFolder: Joi.string().required(),
  etlLogsFolder: Joi.string().required(),
  etlBatchSize: Joi.number().default(2000),
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
  useConnectionStr: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(false),
  managedIdentityClientId: Joi.string().optional()
})

const config = {
  checkCompleteTimeoutMs: 5000,
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  container: 'etl',
  dwhExtractsFolder: 'dwh_extracts_sfi23',
  etlLogsFolder: 'logs',
  etlBatchSize: 2000,
  applicationDetail: {
    folder: applicationDetail,
    fileMask: 'SFI23_STMT_APPLICATION_DETAILS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  appsPaymentNotification: {
    folder: appsPaymentNotification,
    fileMask: 'SFI23_STMT_APPS_PAYMENT_NOTIFICATIONS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  appsTypes: {
    folder: appsTypes,
    fileMask: 'SFI23_STMT_APPS_TYPES_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  businessAddress: {
    folder: businessAddress,
    fileMask: 'SFI23_STMT_BUSINESS_ADDRESS_CONTACT_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  calculationsDetails: {
    folder: calculationsDetails,
    fileMask: 'SFI23_STMT_CALCULATION_DETAILS_MV_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssContractApplications: {
    folder: cssContractApplications,
    fileMask: 'SFI23_STMT_CSS_CONTRACT_APPLICATIONS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssContract: {
    folder: cssContract,
    fileMask: 'SFI23_STMT_CSS_CONTRACTS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  cssOptions: {
    folder: cssOptions,
    fileMask: 'SFI23_STMT_CSS_OPTIONS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  defraLinks: {
    folder: defraLinks,
    fileMask: 'SFI23_STMT_DEFRA_LINKS_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  financeDAX: {
    folder: financeDAX,
    fileMask: 'SFI23_STMT_FINANCE_DAX_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  organisation: {
    folder: organisation,
    fileMask: 'SFI23_STMT_ORGANISATION_SFI_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  tclcOption: {
    folder: tclcOption,
    fileMask: 'SFI23_STMT_TCLC_PII_PAY_CLAIM_SFIMT_OPTION_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  tclc: {
    folder: tclc,
    fileMask: 'SFI23_STMT_TCLC_PII_PAY_CLAIM_SFIMT_V_CHANGE_LOG_\\d{8}_\\d{6}(_v\\d+)?.csv'
  },
  useConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS,
  managedIdentityClientId: process.env.AZURE_CLIENT_ID
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
