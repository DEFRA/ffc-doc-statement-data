const sourceColumnNames = require('../../../../app/constants/source-column-names')
const targetColumnNames = require('../../../../app/constants/target-column-names')
const config = require('../../../../app/config')
const { downloadAndProcessFile } = require('../../../../app/etl/staging/stage-utils')
const { stageDay0Organisation } = require('../../../../app/etl/staging')

jest.mock('../../../../app/etl/staging/stage-utils')

describe('stageDay0Organisation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call downloadAndProcessFile with correct parameters', async () => {
    const expectedColumns = [
      sourceColumnNames.ORGANISATION_WID,
      sourceColumnNames.PARTY_WID_FK,
      sourceColumnNames.REF_BUSINESS_TYPE_WID_FK,
      sourceColumnNames.REF_LEGAL_STATUS_TYPE_WID_FK,
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
      sourceColumnNames.W_INSERT_DT,
      sourceColumnNames.W_UPDATE_DT,
      sourceColumnNames.ETL_PROC_WID,
      sourceColumnNames.INTEGRATION_ID,
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

    await stageDay0Organisation()

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

  test('should include nonProdTransformer when fakeData is true', async () => {
    config.etlConfig.fakeData = true

    await stageDay0Organisation()

    expect(downloadAndProcessFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Array),
      expect.any(Array),
      expect.any(Array),
      expect.any(Array),
      expect.arrayContaining([
        expect.objectContaining({ name: sourceColumnNames.ORGANISATION_NAME }),
        expect.objectContaining({ faker: expect.any(String) })
      ])
    )
  })

  test('should exclude certain fields when excludeCalculationData is true', async () => {
    config.etlConfig.excludeCalculationData = true

    await stageDay0Organisation()

    expect(downloadAndProcessFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Array),
      expect.any(Array),
      expect.arrayContaining([
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
        targetColumnNames.etlProcWid,
        targetColumnNames.integrationId,
        targetColumnNames.financialToBusinessAddr,
        targetColumnNames.landConfirmedFlg,
        targetColumnNames.landDetailsConfirmedDtKey,
        targetColumnNames.legalStatusTypeId,
        targetColumnNames.organisationName,
        targetColumnNames.organisationWid,
        targetColumnNames.partyWidFk,
        targetColumnNames.refBusinessTypeWidFk,
        targetColumnNames.refLegalStatusTypeWidFk,
        targetColumnNames.registrationDate,
        targetColumnNames.taxRegistrationNumber,
        targetColumnNames.traderNumber,
        targetColumnNames.vendorNumber,
        targetColumnNames.wInsertDt,
        targetColumnNames.wUpdateDt
      ]),
      expect.any(Array),
      expect.any(Array)
    )
  })
})
