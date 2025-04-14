const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageAppsTypes')

describe('etlStageAppsTypes Model', () => {
  let etlStageAppsTypes

  beforeAll(() => {
    etlStageAppsTypes = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageAppsTypes.getTableName().name).toBe('etlStageAppsTypes')
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
  })

  test('should have correct options', () => {
    expect(etlStageAppsTypes.options.tableName).toBe('etlStageAppsTypes')
    expect(etlStageAppsTypes.options.freezeTableName).toBe(true)
    expect(etlStageAppsTypes.options.timestamps).toBe(false)
  })
})
