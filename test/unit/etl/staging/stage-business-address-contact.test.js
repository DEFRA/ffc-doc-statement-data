const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
const { stageBusinessAddressContacts } = require('../../../../app/etl/staging/stage-business-address-contact')
const { businessAddress } = require('../../../../app/constants/tables')
const { Readable } = require('stream')

jest.mock('uuid', () => ({ v4: jest.fn() }))
jest.mock('../../../../app/storage', () => ({
  downloadFileAsStream: jest.fn()
}))
jest.mock('../../../../app/config/etl', () => ({
  businessAddress: { folder: 'businessAddressFolder' }
}))
jest.mock('../../../../app/constants/tables', () => ({
  businessAddressTable: 'businessAddressTable'
}))
jest.mock('../../../../app/etl/run-etl-process', () => ({
  runEtlProcess: jest.fn()
}))
jest.mock('../../../../app/config', () => ({
  etlConfig: {
    excludeCalculationData: true,
    businessAddress: { folder: 'businessAddressFolder' },
    fakeData: true
  }
}))

test('stageBusinessAddressContacts downloads file and runs ETL process', async () => {
  const mockUuid = '1234-5678-91011'
  uuidv4.mockReturnValue(mockUuid)
  const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
  const mockReadableStream = Readable.from(mockStreamData.split('\n'))
  storage.downloadFileAsStream.mockResolvedValue(mockReadableStream)

  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'SBI',
    'FRN',
    'BUSINESS_NAME',
    'ACCOUNTABLE_PEOPLE_COMPLETED',
    'FINANCIAL_TO_BUSINESS_ADDR',
    'CORR_AS_BUSINESS_ADDR',
    'BUSINESS_ADDRESS1',
    'BUSINESS_ADDRESS2',
    'BUSINESS_ADDRESS3',
    'BUSINESS_CITY',
    'BUSINESS_COUNTY',
    'BUSINESS_COUNTRY',
    'BUSINESS_POST_CODE',
    'BUSINESS_LANDLINE',
    'BUSINESS_MOBILE',
    'BUSINESS_EMAIL_ADDR',
    'CORRESPONDENCE_ADDRESS1',
    'CORRESPONDENCE_ADDRESS2',
    'CORRESPONDENCE_ADDRESS3',
    'CORRESPONDENCE_CITY',
    'CORRESPONDENCE_COUNTY',
    'CORRESPONDENCE_COUNTRY',
    'CORRESPONDENCE_POST_CODE',
    'CORRESPONDENCE_LANDLINE',
    'CORRESPONDENCE_MOBILE',
    'CORRESPONDENCE_EMAIL_ADDR'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'changeType', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'changeTime', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'SBI', targetColumn: 'sbi', targetType: 'number' },
    { column: 'FRN', targetColumn: 'frn', targetType: 'varchar' },
    { column: 'BUSINESS_NAME', targetColumn: 'businessName', targetType: 'varchar' },
    { column: 'ACCOUNTABLE_PEOPLE_COMPLETED', targetColumn: 'accountablePeopleCompleted', targetType: 'number' },
    { column: 'FINANCIAL_TO_BUSINESS_ADDR', targetColumn: 'financialToBusinessAddr', targetType: 'number' },
    { column: 'CORR_AS_BUSINESS_ADDR', targetColumn: 'corrAsBusinessAddr', targetType: 'number' },
    { column: 'BUSINESS_ADDRESS1', targetColumn: 'businessAddress1', targetType: 'varchar' },
    { column: 'BUSINESS_ADDRESS2', targetColumn: 'businessAddress2', targetType: 'varchar' },
    { column: 'BUSINESS_ADDRESS3', targetColumn: 'businessAddress3', targetType: 'varchar' },
    { column: 'BUSINESS_CITY', targetColumn: 'businessCity', targetType: 'varchar' },
    { column: 'BUSINESS_COUNTY', targetColumn: 'businessCounty', targetType: 'varchar' },
    { column: 'BUSINESS_COUNTRY', targetColumn: 'businessCountry', targetType: 'varchar' },
    { column: 'BUSINESS_POST_CODE', targetColumn: 'businessPostCode', targetType: 'varchar' },
    { column: 'BUSINESS_LANDLINE', targetColumn: 'businessLandline', targetType: 'varchar' },
    { column: 'BUSINESS_MOBILE', targetColumn: 'businessMobile', targetType: 'varchar' },
    { column: 'BUSINESS_EMAIL_ADDR', targetColumn: 'businessEmailAddr', targetType: 'varchar' },
    { column: 'CORRESPONDENCE_ADDRESS1', targetColumn: 'correspondenceAddress1', targetType: 'varchar' },
    { column: 'CORRESPONDENCE_ADDRESS2', targetColumn: 'correspondenceAddress2', targetType: 'varchar' },
    { column: 'CORRESPONDENCE_ADDRESS3', targetColumn: 'correspondenceAddress3', targetType: 'varchar' },
    { column: 'CORRESPONDENCE_CITY', targetColumn: 'correspondenceCity', targetType: 'varchar' },
    { column: 'CORRESPONDENCE_COUNTY', targetColumn: 'correspondenceCounty', targetType: 'varchar' },
    { column: 'CORRESPONDENCE_COUNTRY', targetColumn: 'correspondenceCountry', targetType: 'varchar' },
    { column: 'CORRESPONDENCE_POST_CODE', targetColumn: 'correspondencePostCode', targetType: 'varchar' },
    { column: 'CORRESPONDENCE_LANDLINE', targetColumn: 'correspondenceLandline', targetType: 'varchar' },
    { column: 'CORRESPONDENCE_MOBILE', targetColumn: 'correspondenceMobile', targetType: 'varchar' },
    { column: 'CORRESPONDENCE_EMAIL_ADDR', targetColumn: 'correspondenceEmailAddr', targetType: 'varchar' }
  ]

  const transformer = [
    { column: 'BUSINESS_NAME', find: "'", replace: "''", all: true },
    { column: 'BUSINESS_ADDRESS1', find: "'", replace: "''", all: true },
    { column: 'BUSINESS_ADDRESS2', find: "'", replace: "''", all: true },
    { column: 'BUSINESS_ADDRESS3', find: "'", replace: "''", all: true },
    { column: 'BUSINESS_CITY', find: "'", replace: "''", all: true },
    { column: 'BUSINESS_EMAIL_ADDR', find: "'", replace: "''", all: true },
    { column: 'CORRESPONDENCE_EMAIL_ADDR', find: "'", replace: "''", all: true }
  ]

  const nonProdTransformer = [
    { name: 'BUSINESS_NAME', faker: 'company.name' },
    { name: 'BUSINESS_ADDRESS1', faker: 'location.street' },
    { name: 'BUSINESS_POST_CODE', faker: 'location.zipCode' },
    { name: 'BUSINESS_CITY', faker: 'location.city' },
    { name: 'BUSINESS_EMAIL_ADDR', faker: 'internet.email' },
    { name: 'CORRESPONDENCE_EMAIL_ADDR', faker: 'internet.email' }
  ]

  await stageBusinessAddressContacts()

  expect(storage.downloadFileAsStream).toHaveBeenCalledWith('businessAddressFolder/export.csv')
  expect(runEtlProcess).toHaveBeenCalledWith({
    fileStream: mockReadableStream,
    columns,
    table: businessAddress,
    mapping,
    transformer,
    nonProdTransformer,
    file: 'businessAddressFolder/export.csv',
    excludedFields: [
      'accountablePeopleCompleted',
      'businessCountry',
      'businessLandline',
      'businessMobile',
      'corrAsBusinessAddr',
      'correspondenceAddress1',
      'correspondenceAddress2',
      'correspondenceAddress3',
      'correspondenceCity',
      'correspondenceCountry',
      'correspondenceCounty',
      'correspondenceEmailAddr',
      'correspondenceLandline',
      'correspondenceMobile',
      'correspondencePostCode',
      'financialToBusinessAddr'
    ]
  })
})
