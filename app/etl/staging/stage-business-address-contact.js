const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { businessAddress } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat, monthDayYearDateTimeFormat } = require('./stage-utils')
const config = require('../../config')
const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')
const { COMPANY_NAME, LOCATION_STREET, LOCATION_ZIP_CODE, LOCATION_CITY, INTERNET_EMAIL } = require('../../constants/fakers')

const stageBusinessAddressContacts = async (monthDayFormat = false, folder = 'businessAddress') => {
  const format = monthDayFormat ? monthDayYearDateTimeFormat : dateTimeFormat

  const columns = [
    sourceColumnNames.CHANGE_TYPE,
    sourceColumnNames.CHANGE_TIME,
    sourceColumnNames.SBI,
    sourceColumnNames.FRN,
    sourceColumnNames.BUSINESS_NAME,
    sourceColumnNames.ACCOUNTABLE_PEOPLE_COMPLETED,
    sourceColumnNames.FINANCIAL_TO_BUSINESS_ADDR,
    sourceColumnNames.CORR_AS_BUSINESS_ADDR,
    sourceColumnNames.BUSINESS_ADDRESS1,
    sourceColumnNames.BUSINESS_ADDRESS2,
    sourceColumnNames.BUSINESS_ADDRESS3,
    sourceColumnNames.BUSINESS_CITY,
    sourceColumnNames.BUSINESS_COUNTY,
    sourceColumnNames.BUSINESS_COUNTRY,
    sourceColumnNames.BUSINESS_POST_CODE,
    sourceColumnNames.BUSINESS_LANDLINE,
    sourceColumnNames.BUSINESS_MOBILE,
    sourceColumnNames.BUSINESS_EMAIL_ADDR,
    sourceColumnNames.CORRESPONDENCE_ADDRESS1,
    sourceColumnNames.CORRESPONDENCE_ADDRESS2,
    sourceColumnNames.CORRESPONDENCE_ADDRESS3,
    sourceColumnNames.CORRESPONDENCE_CITY,
    sourceColumnNames.CORRESPONDENCE_COUNTY,
    sourceColumnNames.CORRESPONDENCE_COUNTRY,
    sourceColumnNames.CORRESPONDENCE_POST_CODE,
    sourceColumnNames.CORRESPONDENCE_LANDLINE,
    sourceColumnNames.CORRESPONDENCE_MOBILE,
    sourceColumnNames.CORRESPONDENCE_EMAIL_ADDR
  ]

  const mapping = [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format },
    { column: sourceColumnNames.SBI, targetColumn: targetColumnNames.sbi, targetType: NUMBER },
    { column: sourceColumnNames.FRN, targetColumn: targetColumnNames.frn, targetType: VARCHAR },
    { column: sourceColumnNames.BUSINESS_NAME, targetColumn: targetColumnNames.businessName, targetType: VARCHAR },
    { column: sourceColumnNames.ACCOUNTABLE_PEOPLE_COMPLETED, targetColumn: targetColumnNames.accountablePeopleCompleted, targetType: NUMBER },
    { column: sourceColumnNames.FINANCIAL_TO_BUSINESS_ADDR, targetColumn: targetColumnNames.financialToBusinessAddr, targetType: NUMBER },
    { column: sourceColumnNames.CORR_AS_BUSINESS_ADDR, targetColumn: targetColumnNames.corrAsBusinessAddr, targetType: NUMBER },
    { column: sourceColumnNames.BUSINESS_ADDRESS1, targetColumn: targetColumnNames.businessAddress1, targetType: VARCHAR },
    { column: sourceColumnNames.BUSINESS_ADDRESS2, targetColumn: targetColumnNames.businessAddress2, targetType: VARCHAR },
    { column: sourceColumnNames.BUSINESS_ADDRESS3, targetColumn: targetColumnNames.businessAddress3, targetType: VARCHAR },
    { column: sourceColumnNames.BUSINESS_CITY, targetColumn: targetColumnNames.businessCity, targetType: VARCHAR },
    { column: sourceColumnNames.BUSINESS_COUNTY, targetColumn: targetColumnNames.businessCounty, targetType: VARCHAR },
    { column: sourceColumnNames.BUSINESS_COUNTRY, targetColumn: targetColumnNames.businessCountry, targetType: VARCHAR },
    { column: sourceColumnNames.BUSINESS_POST_CODE, targetColumn: targetColumnNames.businessPostCode, targetType: VARCHAR },
    { column: sourceColumnNames.BUSINESS_LANDLINE, targetColumn: targetColumnNames.businessLandline, targetType: VARCHAR },
    { column: sourceColumnNames.BUSINESS_MOBILE, targetColumn: targetColumnNames.businessMobile, targetType: VARCHAR },
    { column: sourceColumnNames.BUSINESS_EMAIL_ADDR, targetColumn: targetColumnNames.businessEmailAddr, targetType: VARCHAR },
    { column: sourceColumnNames.CORRESPONDENCE_ADDRESS1, targetColumn: targetColumnNames.correspondenceAddress1, targetType: VARCHAR },
    { column: sourceColumnNames.CORRESPONDENCE_ADDRESS2, targetColumn: targetColumnNames.correspondenceAddress2, targetType: VARCHAR },
    { column: sourceColumnNames.CORRESPONDENCE_ADDRESS3, targetColumn: targetColumnNames.correspondenceAddress3, targetType: VARCHAR },
    { column: sourceColumnNames.CORRESPONDENCE_CITY, targetColumn: targetColumnNames.correspondenceCity, targetType: VARCHAR },
    { column: sourceColumnNames.CORRESPONDENCE_COUNTY, targetColumn: targetColumnNames.correspondenceCounty, targetType: VARCHAR },
    { column: sourceColumnNames.CORRESPONDENCE_COUNTRY, targetColumn: targetColumnNames.correspondenceCountry, targetType: VARCHAR },
    { column: sourceColumnNames.CORRESPONDENCE_POST_CODE, targetColumn: targetColumnNames.correspondencePostCode, targetType: VARCHAR },
    { column: sourceColumnNames.CORRESPONDENCE_LANDLINE, targetColumn: targetColumnNames.correspondenceLandline, targetType: VARCHAR },
    { column: sourceColumnNames.CORRESPONDENCE_MOBILE, targetColumn: targetColumnNames.correspondenceMobile, targetType: VARCHAR },
    { column: sourceColumnNames.CORRESPONDENCE_EMAIL_ADDR, targetColumn: targetColumnNames.correspondenceEmailAddr, targetType: VARCHAR }
  ]

  const transformer = [
    { column: sourceColumnNames.BUSINESS_NAME, find: "'", replace: "''", all: true },
    { column: sourceColumnNames.BUSINESS_ADDRESS1, find: "'", replace: "''", all: true },
    { column: sourceColumnNames.BUSINESS_ADDRESS2, find: "'", replace: "''", all: true },
    { column: sourceColumnNames.BUSINESS_ADDRESS3, find: "'", replace: "''", all: true },
    { column: sourceColumnNames.BUSINESS_CITY, find: "'", replace: "''", all: true }
  ]

  let nonProdTransformer = []
  if (!config.isProd) {
    nonProdTransformer = [
      { name: sourceColumnNames.BUSINESS_NAME, faker: COMPANY_NAME },
      { name: sourceColumnNames.BUSINESS_ADDRESS1, faker: LOCATION_STREET },
      { name: sourceColumnNames.BUSINESS_POST_CODE, faker: LOCATION_ZIP_CODE },
      { name: sourceColumnNames.BUSINESS_CITY, faker: LOCATION_CITY },
      { name: sourceColumnNames.BUSINESS_EMAIL_ADDR, faker: INTERNET_EMAIL }
    ]
  }

  return downloadAndProcessFile(folder, businessAddress, columns, mapping, transformer, nonProdTransformer)
}

const stageBusinessAddressContactsDelinked = async () => {
  return stageBusinessAddressContacts(true, 'businessAddressDelinked')
}

module.exports = {
  stageBusinessAddressContacts,
  stageBusinessAddressContactsDelinked
}
