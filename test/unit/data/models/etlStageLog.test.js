const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageLog')

describe('etlStageLog Model', () => {
  let etlStageLog

  beforeAll(() => {
    etlStageLog = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageLog.getTableName()).toBe('etl_stage_log')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageLog.rawAttributes

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)
    expect(attributes.etl_id.primaryKey).toBe(true)
    expect(attributes.etl_id.autoIncrement).toBe(true)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.file).toBeDefined()
    expect(attributes.file.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.started_at).toBeDefined()
    expect(attributes.started_at.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.ended_at).toBeDefined()
    expect(attributes.ended_at.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.row_count).toBeDefined()
    expect(attributes.row_count.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.rows_loaded_count).toBeDefined()
    expect(attributes.rows_loaded_count.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.id_from).toBeDefined()
    expect(attributes.id_from.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.id_to).toBeDefined()
    expect(attributes.id_to.type.key).toBe(DataTypes.INTEGER.key)
  })

  test('should have correct options', () => {
    expect(etlStageLog.options.tableName).toBe('etl_stage_log')
    expect(etlStageLog.options.freezeTableName).toBe(true)
    expect(etlStageLog.options.timestamps).toBe(false)
  })
})
