const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageFinanceDax')

describe('etlStageFinanceDax Model', () => {
  let etlStageFinanceDax

  beforeAll(() => {
    etlStageFinanceDax = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageFinanceDax.getTableName()).toBe('etl_stage_finance_dax')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageFinanceDax.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.finance_dax_wid).toBeDefined()
    expect(attributes.finance_dax_wid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.transdate).toBeDefined()
    expect(attributes.transdate.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.accountype).toBeDefined()
    expect(attributes.accountype.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.invoiceid).toBeDefined()
    expect(attributes.invoiceid.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.invoicedate).toBeDefined()
    expect(attributes.invoicedate.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.scheme).toBeDefined()
    expect(attributes.scheme.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.fund).toBeDefined()
    expect(attributes.fund.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.marketingyear).toBeDefined()
    expect(attributes.marketingyear.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.accountnum).toBeDefined()
    expect(attributes.accountnum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.deliverybody).toBeDefined()
    expect(attributes.deliverybody.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.accrualstatus).toBeDefined()
    expect(attributes.accrualstatus.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.settlementvoucher).toBeDefined()
    expect(attributes.settlementvoucher.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.lineamounteur).toBeDefined()
    expect(attributes.lineamounteur.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.lineamountmstgbp).toBeDefined()
    expect(attributes.lineamountmstgbp.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.transactiontype).toBeDefined()
    expect(attributes.transactiontype.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.journalnum).toBeDefined()
    expect(attributes.journalnum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.journalname).toBeDefined()
    expect(attributes.journalname.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.admindebt).toBeDefined()
    expect(attributes.admindebt.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.voucher).toBeDefined()
    expect(attributes.voucher.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.month).toBeDefined()
    expect(attributes.month.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.amounteur).toBeDefined()
    expect(attributes.amounteur.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.amountmstgbp).toBeDefined()
    expect(attributes.amountmstgbp.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.quarter).toBeDefined()
    expect(attributes.quarter.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.idvoucher).toBeDefined()
    expect(attributes.idvoucher.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.transtxt).toBeDefined()
    expect(attributes.transtxt.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.irregularitydebt).toBeDefined()
    expect(attributes.irregularitydebt.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.sectiontype).toBeDefined()
    expect(attributes.sectiontype.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.transrecid).toBeDefined()
    expect(attributes.transrecid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.ljtransrecid).toBeDefined()
    expect(attributes.ljtransrecid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.glaccountentryrecid).toBeDefined()
    expect(attributes.glaccountentryrecid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.settlementrecid).toBeDefined()
    expect(attributes.settlementrecid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.runnumber).toBeDefined()
    expect(attributes.runnumber.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.reportingtype).toBeDefined()
    expect(attributes.reportingtype.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.custvendac).toBeDefined()
    expect(attributes.custvendac.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.modifieddatetime).toBeDefined()
    expect(attributes.modifieddatetime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.modifiedby).toBeDefined()
    expect(attributes.modifiedby.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.createddatetime).toBeDefined()
    expect(attributes.createddatetime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.createdby).toBeDefined()
    expect(attributes.createdby.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.dataareaid).toBeDefined()
    expect(attributes.dataareaid.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.partition).toBeDefined()
    expect(attributes.partition.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.recid).toBeDefined()
    expect(attributes.recid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.eurunnumber).toBeDefined()
    expect(attributes.eurunnumber.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.accrualledgerdimensionaccount).toBeDefined()
    expect(attributes.accrualledgerdimensionaccount.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.accrualgjaccountentryrecid).toBeDefined()
    expect(attributes.accrualgjaccountentryrecid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.legacyfarmeraccount).toBeDefined()
    expect(attributes.legacyfarmeraccount.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.claimsettlementdate).toBeDefined()
    expect(attributes.claimsettlementdate.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.claimrefnum).toBeDefined()
    expect(attributes.claimrefnum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.iseurelevant).toBeDefined()
    expect(attributes.iseurelevant.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.fundedby).toBeDefined()
    expect(attributes.fundedby.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.euyearstartdate).toBeDefined()
    expect(attributes.euyearstartdate.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.euyearenddate).toBeDefined()
    expect(attributes.euyearenddate.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.yearendrunnumber).toBeDefined()
    expect(attributes.yearendrunnumber.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.reason).toBeDefined()
    expect(attributes.reason.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.exchratecalctype).toBeDefined()
    expect(attributes.exchratecalctype.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.postingdate).toBeDefined()
    expect(attributes.postingdate.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.datawarehouserunnum).toBeDefined()
    expect(attributes.datawarehouserunnum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.crosscompliance).toBeDefined()
    expect(attributes.crosscompliance.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.penalty).toBeDefined()
    expect(attributes.penalty.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.exchfundedeur).toBeDefined()
    expect(attributes.exchfundedeur.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.exchfundedgbp).toBeDefined()
    expect(attributes.exchfundedgbp.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.festxnnum).toBeDefined()
    expect(attributes.festxnnum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.festxnlinenum).toBeDefined()
    expect(attributes.festxnlinenum.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.advpayflag).toBeDefined()
    expect(attributes.advpayflag.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.daxinvoicenum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.dwhtxntype).toBeDefined()
    expect(attributes.dwhtxntype.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.retention).toBeDefined()
    expect(attributes.retention.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.dummyt104).toBeDefined()
    expect(attributes.dummyt104.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.f106gbp).toBeDefined()
    expect(attributes.f106gbp.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.schemeexchangerate).toBeDefined()
    expect(attributes.schemeexchangerate.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.agreementreference).toBeDefined()
    expect(attributes.agreementreference.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.oedate).toBeDefined()
    expect(attributes.oedate.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.settlementvoucher1).toBeDefined()
    expect(attributes.settlementvoucher1.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.annexiitranstype).toBeDefined()
    expect(attributes.annexiitranstype.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.bpallocationtype).toBeDefined()
    expect(attributes.bpallocationtype.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.schemetype).toBeDefined()
    expect(attributes.schemetype.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.applicationreference).toBeDefined()
    expect(attributes.applicationreference.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageFinanceDax.options.tableName).toBe('etl_stage_finance_dax')
    expect(etlStageFinanceDax.options.freezeTableName).toBe(true)
    expect(etlStageFinanceDax.options.timestamps).toBe(false)
  })
})
