const Joi = require('joi')
const { applicationDetailFolder, appsPaymentNotificationFolder, appsTypesFolder, businessAddressFolder, calculationsDetailsFolder, cssContractApplicationsFolder, cssContractFolder, cssOptionsFolder, defraLinksFolder, financeDAXFolder, organisationFolder, tclcOptionFolder, tclcFolder } = require('../constants/folders')

const schema = Joi.object({
  checkCompleteTimeoutMs: Joi.number().required(),
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  container: Joi.string().required(),
  dwhExtractsFolder: Joi.string().required(),
  etlLogsFolder: Joi.string().required(),
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
  createContainers: Joi.boolean().default(false)
})

const config = {
  checkCompleteTimeoutMs: 5000,
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  container: 'etl',
  dwhExtractsFolder: 'dwh_extracts',
  etlLogsFolder: 'logs',
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
