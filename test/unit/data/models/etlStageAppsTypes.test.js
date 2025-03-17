const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageAppsTypes')

describe('etlStageAppsTypes Model', () => {
  let etlStageAppsTypes

  beforeAll(() => {
    etlStageAppsTypes = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageAppsTypes.getTableName()).toBe('etlStageAppsTypes')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageAppsTypes.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.appTypeId).toBeDefined()
    expect(attributes.appTypeId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.sectorPCode).toBeDefined()
    expect(attributes.sectorPCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.sectorSCode).toBeDefined()
    expect(attributes.sectorSCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.shortDescription).toBeDefined()
    expect(attributes.shortDescription.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.extDescription).toBeDefined()
    expect(attributes.extDescription.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.year).toBeDefined()
    expect(attributes.year.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.winOpenDate).toBeDefined()
    expect(attributes.winOpenDate.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.winCloseDate).toBeDefined()
    expect(attributes.winCloseDate.type.key).toBe(DataTypes.DATE.key)
  })

  test('should have correct options', () => {
    expect(etlStageAppsTypes.options.tableName).toBe('etlStageAppsTypes')
    expect(etlStageAppsTypes.options.freezeTableName).toBe(true)
    expect(etlStageAppsTypes.options.timestamps).toBe(false)
  })
})
