const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageFinanceDax')

describe('etlStageFinanceDax Model', () => {
  let etlStageFinanceDax

  beforeAll(() => {
    etlStageFinanceDax = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageFinanceDax.getTableName().name).toBe('etlStageFinanceDax')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageFinanceDax.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.financeDaxWid).toBeDefined()
    expect(attributes.financeDaxWid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.transdate).toBeDefined()
    expect(attributes.transdate.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.invoiceid).toBeDefined()
    expect(attributes.invoiceid.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.scheme).toBeDefined()
    expect(attributes.scheme.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.fund).toBeDefined()
    expect(attributes.fund.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.marketingyear).toBeDefined()
    expect(attributes.marketingyear.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.accountnum).toBeDefined()
    expect(attributes.accountnum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.settlementvoucher).toBeDefined()
    expect(attributes.settlementvoucher.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.lineamountmstgbp).toBeDefined()
    expect(attributes.lineamountmstgbp.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.month).toBeDefined()
    expect(attributes.month.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.amountmstgbp).toBeDefined()
    expect(attributes.amountmstgbp.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.quarter).toBeDefined()
    expect(attributes.quarter.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.custvendac).toBeDefined()
    expect(attributes.custvendac.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.recid).toBeDefined()
    expect(attributes.recid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.agreementreference).toBeDefined()
    expect(attributes.agreementreference.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.schemetype).toBeDefined()
    expect(attributes.schemetype.type.key).toBe(DataTypes.INTEGER.key)
  })

  test('should have correct options', () => {
    expect(etlStageFinanceDax.options.tableName).toBe('etlStageFinanceDax')
    expect(etlStageFinanceDax.options.freezeTableName).toBe(true)
    expect(etlStageFinanceDax.options.timestamps).toBe(false)
  })
})
