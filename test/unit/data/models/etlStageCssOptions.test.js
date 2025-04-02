const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageCssOptions')

describe('etlStageCssOptions Model', () => {
  let etlStageCssOptions

  beforeAll(() => {
    etlStageCssOptions = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageCssOptions.getTableName().name).toBe('etlStageCssOptions')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageCssOptions.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.cssOptionId).toBeDefined()
    expect(attributes.cssOptionId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.optionTypeId).toBeDefined()
    expect(attributes.optionTypeId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.optionDescription).toBeDefined()
    expect(attributes.optionDescription.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.optionLongDescription).toBeDefined()
    expect(attributes.optionLongDescription.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.duration).toBeDefined()
    expect(attributes.duration.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.optionCode).toBeDefined()
    expect(attributes.optionCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.contractTypeId).toBeDefined()
    expect(attributes.contractTypeId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.startDt).toBeDefined()
    expect(attributes.startDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.endDt).toBeDefined()
    expect(attributes.endDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.groupId).toBeDefined()
    expect(attributes.groupId.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageCssOptions.options.tableName).toBe('etlStageCssOptions')
    expect(etlStageCssOptions.options.freezeTableName).toBe(true)
    expect(etlStageCssOptions.options.timestamps).toBe(false)
  })
})
