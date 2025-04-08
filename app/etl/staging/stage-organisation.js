const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { organisation } = require('../../constants/tables')
const config = require('../../config')
const { downloadAndProcessFile, dateTimeFormat } = require('./stage-utils')
const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')
const { COMPANY_NAME } = require('../../constants/fakers')

const columns = [
  sourceColumnNames.CHANGE_TYPE,
  sourceColumnNames.CHANGE_TIME,
  sourceColumnNames.PARTY_ID,
  sourceColumnNames.ORGANISATION_NAME,
  sourceColumnNames.CONFIRMED_FLG,
  sourceColumnNames.LAND_CONFIRMED_FLG,
  sourceColumnNames.SBI,
  sourceColumnNames.TAX_REGISTRATION_NUMBER,
  sourceColumnNames.LEGAL_STATUS_TYPE_ID,
  sourceColumnNames.BUSINESS_REFERENCE,
  sourceColumnNames.BUSINESS_TYPE_ID,
  sourceColumnNames.VENDOR_NUMBER,
  sourceColumnNames.LAND_DETAILS_CONFIRMED_DT_KEY,
  sourceColumnNames.BUSINESS_DET_CONFIRMED_DT_KEY,
  sourceColumnNames.REGISTRATION_DATE,
  sourceColumnNames.CHARITY_COMMISSION_REGNUM,
  sourceColumnNames.COMPANIES_HOUSE_REGNUM,
  sourceColumnNames.ADDITIONAL_BUSINESSES,
  sourceColumnNames.AMENDED,
  sourceColumnNames.TRADER_NUMBER,
  sourceColumnNames.DATE_STARTED_FARMING,
  sourceColumnNames.ACCOUNTABLE_PEOPLE_COMPLETED,
  sourceColumnNames.FINANCIAL_TO_BUSINESS_ADDR,
  sourceColumnNames.CORR_AS_BUSINESS_ADDR,
  sourceColumnNames.LAST_UPDATED_ON
]

const mapping = [
  { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
  { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format: dateTimeFormat },
  { column: sourceColumnNames.PARTY_ID, targetColumn: targetColumnNames.partyId, targetType: NUMBER },
  { column: sourceColumnNames.ORGANISATION_NAME, targetColumn: targetColumnNames.organisationName, targetType: VARCHAR },
  { column: sourceColumnNames.CONFIRMED_FLG, targetColumn: targetColumnNames.confirmedFlg, targetType: VARCHAR },
  { column: sourceColumnNames.LAND_CONFIRMED_FLG, targetColumn: targetColumnNames.landConfirmedFlg, targetType: NUMBER },
  { column: sourceColumnNames.SBI, targetColumn: targetColumnNames.sbi, targetType: NUMBER },
  { column: sourceColumnNames.TAX_REGISTRATION_NUMBER, targetColumn: targetColumnNames.taxRegistrationNumber, targetType: VARCHAR },
  { column: sourceColumnNames.LEGAL_STATUS_TYPE_ID, targetColumn: targetColumnNames.legalStatusTypeId, targetType: NUMBER },
  { column: sourceColumnNames.BUSINESS_REFERENCE, targetColumn: targetColumnNames.businessReference, targetType: VARCHAR },
  { column: sourceColumnNames.BUSINESS_TYPE_ID, targetColumn: targetColumnNames.businessTypeId, targetType: NUMBER },
  { column: sourceColumnNames.VENDOR_NUMBER, targetColumn: targetColumnNames.vendorNumber, targetType: VARCHAR },
  { column: sourceColumnNames.LAND_DETAILS_CONFIRMED_DT_KEY, targetColumn: targetColumnNames.landDetailsConfirmedDtKey, targetType: NUMBER },
  { column: sourceColumnNames.BUSINESS_DET_CONFIRMED_DT_KEY, targetColumn: targetColumnNames.businessDetConfirmedDtKey, targetType: NUMBER },
  { column: sourceColumnNames.REGISTRATION_DATE, targetColumn: targetColumnNames.registrationDate, targetType: DATE, format: dateTimeFormat },
  { column: sourceColumnNames.CHARITY_COMMISSION_REGNUM, targetColumn: targetColumnNames.charityCommissionRegnum, targetType: VARCHAR },
  { column: sourceColumnNames.COMPANIES_HOUSE_REGNUM, targetColumn: targetColumnNames.companiesHouseRegnum, targetType: VARCHAR },
  { column: sourceColumnNames.ADDITIONAL_BUSINESSES, targetColumn: targetColumnNames.additionalBusinesses, targetType: NUMBER },
  { column: sourceColumnNames.AMENDED, targetColumn: targetColumnNames.amended, targetType: NUMBER },
  { column: sourceColumnNames.TRADER_NUMBER, targetColumn: targetColumnNames.traderNumber, targetType: VARCHAR },
  { column: sourceColumnNames.DATE_STARTED_FARMING, targetColumn: targetColumnNames.dateStartedFarming, targetType: DATE, format: dateTimeFormat },
  { column: sourceColumnNames.ACCOUNTABLE_PEOPLE_COMPLETED, targetColumn: targetColumnNames.accountablePeopleCompleted, targetType: NUMBER },
  { column: sourceColumnNames.FINANCIAL_TO_BUSINESS_ADDR, targetColumn: targetColumnNames.financialToBusinessAddr, targetType: NUMBER },
  { column: sourceColumnNames.CORR_AS_BUSINESS_ADDR, targetColumn: targetColumnNames.corrAsBusinessAddr, targetType: NUMBER },
  { column: sourceColumnNames.LAST_UPDATED_ON, targetColumn: targetColumnNames.lastUpdatedOn, targetType: DATE, format: dateTimeFormat }
]

const transformer = [
  {
    column: sourceColumnNames.ORGANISATION_NAME,
    find: '\'',
    replace: '\'\'',
    all: true
  }
]

let nonProdTransformer = []
if (!config.isProd) {
  nonProdTransformer = [
    {
      name: sourceColumnNames.ORGANISATION_NAME,
      faker: COMPANY_NAME
    }
  ]
}

let excludedFields = []
if (config.etlConfig.excludeCalculationData) {
  excludedFields = [
    targetColumnNames.accountablePeopleCompleted,
    targetColumnNames.additionalBusinesses,
    targetColumnNames.amended,
    targetColumnNames.businessDetConfirmedDtKey,
    targetColumnNames.businessReference,
    targetColumnNames.businessTypeId,
    targetColumnNames.charityCommissionRegnum,
    targetColumnNames.companiesHouseRegnum,
    targetColumnNames.confirmedFlg,
    targetColumnNames.corrAsBusinessAddr,
    targetColumnNames.dateStartedFarming,
    targetColumnNames.financialToBusinessAddr,
    targetColumnNames.landConfirmedFlg,
    targetColumnNames.landDetailsConfirmedDtKey,
    targetColumnNames.legalStatusTypeId,
    targetColumnNames.organisationName,
    targetColumnNames.registrationDate,
    targetColumnNames.taxRegistrationNumber,
    targetColumnNames.traderNumber,
    targetColumnNames.vendorNumber
  ]
}

const stageOrganisation = async () => {
  return downloadAndProcessFile('organisation', organisation, columns, mapping, excludedFields, transformer, nonProdTransformer)
}

module.exports = {
  stageOrganisation
}
