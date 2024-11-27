const Joi = require('joi')
const { applicationDetailFolder, appsPaymentNotificationFolder, appsTypesFolder, businessAddressFolder, calculationsDetailsFolder, calcResultsDelinkPaymentsFolder, defraLinksFolder, financeDAXFolder, organisationFolder, tdeLinkingFolder } = require('../constants/delinked-folders')

const schema = Joi.object({
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
  calcResultsDelinkPayments: Joi.object({
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
  tdeLinking: Joi.object({
    folder: Joi.string().required(),
    fileMask: Joi.string().required()
  }).required(),
  useConnectionStr: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(false)
})

const config = {
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  container: 'etl',
  dwhExtractsFolder: 'dwh_extracts/delinked',
  etlLogsFolder: 'logs',
  applicationDetail: {
    folder: applicationDetailFolder,
    fileMask: 'DELINKED_STMT_APPLICATION_DETAILS_V_\\d{8}_\\d{6}_v\\d+\\.csv'
  },
  appsPaymentNotification: {
    folder: appsPaymentNotificationFolder,
    fileMask: 'DELINKED_STMT_APPS_PAYMENT_NOTIFICATIONS_V_\\d{8}_\\d{6}_v\\d+\\.csv'
  },
  appsTypes: {
    folder: appsTypesFolder,
    fileMask: 'DELINKED_STMT_APPS_TYPES_V_\\d{8}_\\d{6}_v\\d+\\.csv'
  },
  businessAddress: {
    folder: businessAddressFolder,
    fileMask: 'DELINKED_STMT_BUSINESS_ADDRESS_CONTACT_V_\\d{8}_\\d{6}_v\\d+\\.csv'
  },
  calculationsDetails: {
    folder: calculationsDetailsFolder,
    fileMask: 'DELINKED_STMT_CALCULATION_DETAILS_MV_V_\\d{8}_\\d{6}_v\\d+\\.csv'
  },
  calcResultsDelinkPayments: {
    folder: calcResultsDelinkPaymentsFolder,
    fileMask: 'DELINKED_STMT_APPLICATION_CALC_RESULTS_DELINKPAYMENTS_\\d{8}_\\d{6}_v\\d+\\.csv'
  },
  defraLinks: {
    folder: defraLinksFolder,
    fileMask: 'DELINKED_STMT_DEFRA_LINKS_V_\\d{8}_\\d{6}_v\\d+\\.csv'
  },
  financeDAX: {
    folder: financeDAXFolder,
    fileMask: 'DELINKED_STMT_FINANCE_DAX_V_\\d{8}_\\d{6}_v\\d+\\.csv'
  },
  organisation: {
    folder: organisationFolder,
    fileMask: 'DELINKED_STMT_ORGANISATION_SFI_V_\\d{8}_\\d{6}_v\\d+\\.csv'
  },
  tdeLinking: {
    folder: tdeLinkingFolder,
    fileMask: 'DELINKED_STMT_TDELINKING_TRANSFER_TRANSACTIONS_\\d{8}_\\d{6}_v\\d+\\.csv'
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
