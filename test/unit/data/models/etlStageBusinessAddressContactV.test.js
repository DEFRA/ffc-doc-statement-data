const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageBusinessAddressContactV')

describe('etlStageBusinessAddressContactV Model', () => {
  let etlStageBusinessAddressContactV

  beforeAll(() => {
    etlStageBusinessAddressContactV = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageBusinessAddressContactV.getTableName().name).toBe('etlStageBusinessAddressContactV')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageBusinessAddressContactV.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.sbi).toBeDefined()
    expect(attributes.sbi.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.frn).toBeDefined()
    expect(attributes.frn.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.businessName).toBeDefined()
    expect(attributes.businessName.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.businessAddress1).toBeDefined()
    expect(attributes.businessAddress1.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.businessAddress2).toBeDefined()
    expect(attributes.businessAddress2.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.businessAddress3).toBeDefined()
    expect(attributes.businessAddress3.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.businessCity).toBeDefined()
    expect(attributes.businessCity.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.businessCounty).toBeDefined()
    expect(attributes.businessCounty.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.businessPostCode).toBeDefined()
    expect(attributes.businessPostCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.businessEmailAddr).toBeDefined()
    expect(attributes.businessEmailAddr.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageBusinessAddressContactV.options.tableName).toBe('etlStageBusinessAddressContactV')
    expect(etlStageBusinessAddressContactV.options.freezeTableName).toBe(true)
    expect(etlStageBusinessAddressContactV.options.timestamps).toBe(false)
  })
})
