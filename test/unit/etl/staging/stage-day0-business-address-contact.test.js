const config = require('../../../../app/config')
const sourceColumnNames = require('../../../../app/constants/source-column-names')
const targetColumnNames = require('../../../../app/constants/target-column-names')
const { stageDay0BusinessAddressContacts } = require('../../../../app/etl/staging')
const { downloadAndProcessFile } = require('../../../../app/etl/staging/stage-utils')

jest.mock('../../../../app/etl/staging/stage-utils')

describe('stageDay0BusinessAddressContacts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call downloadAndProcessFile with correct parameters when monthDayFormat is false', async () => {
    const expectedColumns = [
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

    await stageDay0BusinessAddressContacts()

    expect(downloadAndProcessFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expectedColumns,
      expect.any(Array),
      expect.any(Array),
      expect.any(Array),
      expect.any(Array)
    )
  })

  test('should call downloadAndProcessFile with correct parameters when monthDayFormat is true', async () => {
    await stageDay0BusinessAddressContacts(true)

    expect(downloadAndProcessFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Array),
      expect.any(Array),
      expect.any(Array),
      expect.any(Array),
      expect.any(Array)
    )
  })

  test('should include nonProdTransformer when fakeData is true', async () => {
    config.etlConfig.fakeData = true

    await stageDay0BusinessAddressContacts()

    expect(downloadAndProcessFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Array),
      expect.any(Array),
      expect.any(Array),
      expect.any(Array),
      expect.arrayContaining([
        expect.objectContaining({ name: sourceColumnNames.BUSINESS_NAME }),
        expect.objectContaining({ name: sourceColumnNames.BUSINESS_ADDRESS1 })
      ])
    )
  })

  test('should exclude certain fields when excludeCalculationData is true', async () => {
    config.etlConfig.excludeCalculationData = true

    await stageDay0BusinessAddressContacts()

    expect(downloadAndProcessFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Array),
      expect.any(Array),
      expect.arrayContaining([
        targetColumnNames.accountablePeopleCompleted,
        targetColumnNames.businessCountry
      ]),
      expect.any(Array),
      expect.any(Array)
    )
  })
})
