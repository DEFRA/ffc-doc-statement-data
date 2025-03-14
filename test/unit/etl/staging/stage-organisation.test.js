const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
const { stageOrganisation } = require('../../../../app/etl/staging/stage-organisation')
const { organisation } = require('../../../../app/constants/tables')
const { Readable } = require('stream')

jest.mock('uuid', () => ({ v4: jest.fn() }))
jest.mock('../../../../app/storage', () => ({
  downloadFileAsStream: jest.fn()
}))
jest.mock('../../../../app/config/storage', () => ({
  organisation: { folder: 'organisationFolder' }
}))
jest.mock('../../../../app/constants/tables', () => ({
  organisationTable: 'organisationTable'
}))
jest.mock('../../../../app/etl/run-etl-process', () => ({
  runEtlProcess: jest.fn()
}))
jest.mock('../../../../app/config', () => ({
  isProd: false
}))

test('stageOrganisation downloads file and runs ETL process', async () => {
  const mockUuid = '1234-5678-91011'
  uuidv4.mockReturnValue(mockUuid)
  const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
  const mockReadableStream = Readable.from(mockStreamData.split('\n'))
  storage.downloadFileAsStream.mockResolvedValue(mockReadableStream)

  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'PARTY_ID',
    'ORGANISATION_NAME',
    'CONFIRMED_FLG',
    'LAND_CONFIRMED_FLG',
    'SBI',
    'TAX_REGISTRATION_NUMBER',
    'LEGAL_STATUS_TYPE_ID',
    'BUSINESS_REFERENCE',
    'BUSINESS_TYPE_ID',
    'VENDOR_NUMBER',
    'LAND_DETAILS_CONFIRMED_DT_KEY',
    'BUSINESS_DET_CONFIRMED_DT_KEY',
    'REGISTRATION_DATE',
    'CHARITY_COMMISSION_REGNUM',
    'COMPANIES_HOUSE_REGNUM',
    'ADDITIONAL_BUSINESSES',
    'AMENDED',
    'TRADER_NUMBER',
    'DATE_STARTED_FARMING',
    'ACCOUNTABLE_PEOPLE_COMPLETED',
    'FINANCIAL_TO_BUSINESS_ADDR',
    'CORR_AS_BUSINESS_ADDR',
    'LAST_UPDATED_ON'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'PARTY_ID', targetColumn: 'party_id', targetType: 'number' },
    { column: 'ORGANISATION_NAME', targetColumn: 'organisation_name', targetType: 'varchar' },
    { column: 'CONFIRMED_FLG', targetColumn: 'confirmed_flg', targetType: 'varchar' },
    { column: 'LAND_CONFIRMED_FLG', targetColumn: 'land_confirmed_flg', targetType: 'number' },
    { column: 'SBI', targetColumn: 'sbi', targetType: 'number' },
    { column: 'TAX_REGISTRATION_NUMBER', targetColumn: 'tax_registration_number', targetType: 'varchar' },
    { column: 'LEGAL_STATUS_TYPE_ID', targetColumn: 'legal_status_type_id', targetType: 'number' },
    { column: 'BUSINESS_REFERENCE', targetColumn: 'business_reference', targetType: 'varchar' },
    { column: 'BUSINESS_TYPE_ID', targetColumn: 'business_type_id', targetType: 'number' },
    { column: 'VENDOR_NUMBER', targetColumn: 'vendor_number', targetType: 'varchar' },
    { column: 'LAND_DETAILS_CONFIRMED_DT_KEY', targetColumn: 'land_details_confirmed_dt_key', targetType: 'number' },
    { column: 'BUSINESS_DET_CONFIRMED_DT_KEY', targetColumn: 'business_det_confirmed_dt_key', targetType: 'number' },
    { column: 'REGISTRATION_DATE', targetColumn: 'registration_date', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'CHARITY_COMMISSION_REGNUM', targetColumn: 'charity_commission_regnum', targetType: 'varchar' },
    { column: 'COMPANIES_HOUSE_REGNUM', targetColumn: 'companies_house_regnum', targetType: 'varchar' },
    { column: 'ADDITIONAL_BUSINESSES', targetColumn: 'additional_businesses', targetType: 'number' },
    { column: 'AMENDED', targetColumn: 'amended', targetType: 'number' },
    { column: 'TRADER_NUMBER', targetColumn: 'trader_number', targetType: 'varchar' },
    { column: 'DATE_STARTED_FARMING', targetColumn: 'date_started_farming', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'ACCOUNTABLE_PEOPLE_COMPLETED', targetColumn: 'accountable_people_completed', targetType: 'number' },
    { column: 'FINANCIAL_TO_BUSINESS_ADDR', targetColumn: 'financial_to_business_addr', targetType: 'number' },
    { column: 'CORR_AS_BUSINESS_ADDR', targetColumn: 'corr_as_business_addr', targetType: 'number' },
    { column: 'LAST_UPDATED_ON', targetColumn: 'last_updated_on', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' }
  ]

  const transformer = [
    { column: 'ORGANISATION_NAME', find: "'", replace: "''", all: true }
  ]

  const nonProdTransformer = [
    { name: 'ORGANISATION_NAME', faker: 'company.name' }
  ]

  await stageOrganisation()

  expect(storage.downloadFileAsStream).toHaveBeenCalledWith('organisationFolder/export.csv')
  expect(runEtlProcess).toHaveBeenCalledWith({
    fileStream: mockReadableStream,
    columns,
    table: organisation,
    mapping,
    transformer,
    nonProdTransformer,
    file: 'organisationFolder/export.csv'
  })
})
