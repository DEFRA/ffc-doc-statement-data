const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageLog')

describe('etlStageLog Model', () => {
  let etlStageLog

  beforeAll(() => {
    etlStageLog = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageLog.getTableName().name).toBe('etlStageLog')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageLog.rawAttributes

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)
    expect(attributes.etlId.primaryKey).toBe(true)
    expect(attributes.etlId.autoIncrement).toBe(true)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.file).toBeDefined()
    expect(attributes.file.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.startedAt).toBeDefined()
    expect(attributes.startedAt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.endedAt).toBeDefined()
    expect(attributes.endedAt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.rowCount).toBeDefined()
    expect(attributes.rowCount.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.rowsLoadedCount).toBeDefined()
    expect(attributes.rowsLoadedCount.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.idFrom).toBeDefined()
    expect(attributes.idFrom.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.idTo).toBeDefined()
    expect(attributes.idTo.type.key).toBe(DataTypes.INTEGER.key)
  })

  test('should have correct options', () => {
    expect(etlStageLog.options.tableName).toBe('etlStageLog')
    expect(etlStageLog.options.freezeTableName).toBe(true)
    expect(etlStageLog.options.timestamps).toBe(false)
  })
})
