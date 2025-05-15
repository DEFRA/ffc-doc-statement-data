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
jest.mock('../../../../app/config/etl', () => ({
  organisation: { folder: 'organisationFolder' }
}))
jest.mock('../../../../app/constants/tables', () => ({
  organisationTable: 'organisationTable'
}))
jest.mock('../../../../app/etl/run-etl-process', () => ({
  runEtlProcess: jest.fn()
}))
jest.mock('../../../../app/config', () => ({
  etlConfig: {
    excludeCalculationData: true,
    organisation: { folder: 'organisationFolder' },
    fakeData: true
  }
}))

describe('stageOrganisation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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
      { column: 'CHANGE_TYPE', targetColumn: 'changeType', targetType: 'varchar' },
      { column: 'CHANGE_TIME', targetColumn: 'changeTime', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
      { column: 'PARTY_ID', targetColumn: 'partyId', targetType: 'number' },
      { column: 'ORGANISATION_NAME', targetColumn: 'organisationName', targetType: 'varchar' },
      { column: 'CONFIRMED_FLG', targetColumn: 'confirmedFlg', targetType: 'varchar' },
      { column: 'LAND_CONFIRMED_FLG', targetColumn: 'landConfirmedFlg', targetType: 'number' },
      { column: 'SBI', targetColumn: 'sbi', targetType: 'number' },
      { column: 'TAX_REGISTRATION_NUMBER', targetColumn: 'taxRegistrationNumber', targetType: 'varchar' },
      { column: 'LEGAL_STATUS_TYPE_ID', targetColumn: 'legalStatusTypeId', targetType: 'number' },
      { column: 'BUSINESS_REFERENCE', targetColumn: 'businessReference', targetType: 'varchar' },
      { column: 'BUSINESS_TYPE_ID', targetColumn: 'businessTypeId', targetType: 'number' },
      { column: 'VENDOR_NUMBER', targetColumn: 'vendorNumber', targetType: 'varchar' },
      { column: 'LAND_DETAILS_CONFIRMED_DT_KEY', targetColumn: 'landDetailsConfirmedDtKey', targetType: 'number' },
      { column: 'BUSINESS_DET_CONFIRMED_DT_KEY', targetColumn: 'businessDetConfirmedDtKey', targetType: 'number' },
      { column: 'REGISTRATION_DATE', targetColumn: 'registrationDate', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
      { column: 'CHARITY_COMMISSION_REGNUM', targetColumn: 'charityCommissionRegnum', targetType: 'varchar' },
      { column: 'COMPANIES_HOUSE_REGNUM', targetColumn: 'companiesHouseRegnum', targetType: 'varchar' },
      { column: 'ADDITIONAL_BUSINESSES', targetColumn: 'additionalBusinesses', targetType: 'number' },
      { column: 'AMENDED', targetColumn: 'amended', targetType: 'number' },
      { column: 'TRADER_NUMBER', targetColumn: 'traderNumber', targetType: 'varchar' },
      { column: 'DATE_STARTED_FARMING', targetColumn: 'dateStartedFarming', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
      { column: 'ACCOUNTABLE_PEOPLE_COMPLETED', targetColumn: 'accountablePeopleCompleted', targetType: 'number' },
      { column: 'FINANCIAL_TO_BUSINESS_ADDR', targetColumn: 'financialToBusinessAddr', targetType: 'number' },
      { column: 'CORR_AS_BUSINESS_ADDR', targetColumn: 'corrAsBusinessAddr', targetType: 'number' },
      { column: 'LAST_UPDATED_ON', targetColumn: 'lastUpdatedOn', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' }
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
      file: 'organisationFolder/export.csv',
      excludedFields: [
        'accountablePeopleCompleted',
        'additionalBusinesses',
        'amended',
        'businessDetConfirmedDtKey',
        'businessReference',
        'businessTypeId',
        'charityCommissionRegnum',
        'companiesHouseRegnum',
        'confirmedFlg',
        'corrAsBusinessAddr',
        'dateStartedFarming',
        'financialToBusinessAddr',
        'landConfirmedFlg',
        'landDetailsConfirmedDtKey',
        'legalStatusTypeId',
        'organisationName',
        'registrationDate',
        'taxRegistrationNumber',
        'traderNumber',
        'vendorNumber'
      ]
    })
  })

  test('stageOrganisation sets nonProdTransformer to empty when fakeData is false', async () => {
    jest.resetModules()
    jest.doMock('../../../../app/config', () => ({
      etlConfig: {
        excludeCalculationData: true,
        organisation: { folder: 'organisationFolder' },
        fakeData: false
      }
    }))
    const storage = require('../../../../app/storage')
    const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
    const { stageOrganisation } = require('../../../../app/etl/staging/stage-organisation')
    const { Readable } = require('stream')
    const uuid = require('uuid')
    uuid.v4.mockReturnValue('1234-5678-91011')
    const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\n'
    const mockReadableStream = Readable.from(mockStreamData.split('\n'))
    storage.downloadFileAsStream.mockResolvedValue(mockReadableStream)

    await stageOrganisation()

    expect(runEtlProcess).toHaveBeenCalledWith(
      expect.objectContaining({
        nonProdTransformer: []
      })
    )
  })

  test('stageOrganisation sets excludedFields to empty when excludeCalculationData is false', async () => {
    jest.resetModules()
    jest.doMock('../../../../app/config', () => ({
      etlConfig: {
        excludeCalculationData: false,
        organisation: { folder: 'organisationFolder' },
        fakeData: true
      }
    }))
    const storage = require('../../../../app/storage')
    const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
    const { stageOrganisation } = require('../../../../app/etl/staging/stage-organisation')
    const { Readable } = require('stream')
    const uuid = require('uuid')
    uuid.v4.mockReturnValue('1234-5678-91011')
    const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\n'
    const mockReadableStream = Readable.from(mockStreamData.split('\n'))
    storage.downloadFileAsStream.mockResolvedValue(mockReadableStream)

    await stageOrganisation()

    expect(runEtlProcess).toHaveBeenCalledWith(
      expect.objectContaining({
        excludedFields: []
      })
    )
  })

  test('stageOrganisation uses monthDayYearDateTimeFormat when monthDayFormat is true', async () => {
    jest.resetModules()
    jest.doMock('../../../../app/config', () => ({
      etlConfig: {
        excludeCalculationData: true,
        organisation: { folder: 'organisationFolder' },
        fakeData: true
      }
    }))
    const storage = require('../../../../app/storage')
    const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
    const { stageOrganisation } = require('../../../../app/etl/staging/stage-organisation')
    const { Readable } = require('stream')
    const uuid = require('uuid')
    uuid.v4.mockReturnValue('1234-5678-91011')
    const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\n'
    const mockReadableStream = Readable.from(mockStreamData.split('\n'))
    storage.downloadFileAsStream.mockResolvedValue(mockReadableStream)

    await stageOrganisation(true)

    // Check mapping uses the correct format string
    const callArgs = runEtlProcess.mock.calls[0][0]
    const mapping = callArgs.mapping
    expect(mapping[1].format).toBe(require('../../../../app/etl/staging/stage-utils').monthDayYearDateTimeFormat)
  })
})
