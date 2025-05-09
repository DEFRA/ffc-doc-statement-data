const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageCssContracts')

describe('etlStageCssContracts Model', () => {
  let etlStageCssContracts

  beforeAll(() => {
    etlStageCssContracts = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageCssContracts.getTableName().name).toBe('etlStageCssContracts')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageCssContracts.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.cssContractWid).toBeDefined()
    expect(attributes.cssContractWid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.pkid).toBeDefined()
    expect(attributes.pkid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.contractId).toBeDefined()
    expect(attributes.contractId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.dataSourcePCode).toBeDefined()
    expect(attributes.dataSourcePCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.dataSourceSCode).toBeDefined()
    expect(attributes.dataSourceSCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.startDt).toBeDefined()
    expect(attributes.startDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.endDt).toBeDefined()
    expect(attributes.endDt.type.key).toBe(DataTypes.DATE.key)
  })

  test('should have correct options', () => {
    expect(etlStageCssContracts.options.tableName).toBe('etlStageCssContracts')
    expect(etlStageCssContracts.options.freezeTableName).toBe(true)
    expect(etlStageCssContracts.options.timestamps).toBe(false)
  })
})
