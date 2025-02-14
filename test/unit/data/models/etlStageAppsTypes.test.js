const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageAppsTypes')

describe('etlStageAppsTypes Model', () => {
  let etlStageAppsTypes

  beforeAll(() => {
    etlStageAppsTypes = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageAppsTypes.getTableName()).toBe('etl_stage_apps_types')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageAppsTypes.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.app_type_id).toBeDefined()
    expect(attributes.app_type_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.sector_p_code).toBeDefined()
    expect(attributes.sector_p_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.sector_s_code).toBeDefined()
    expect(attributes.sector_s_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.short_description).toBeDefined()
    expect(attributes.short_description.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.ext_description).toBeDefined()
    expect(attributes.ext_description.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.year).toBeDefined()
    expect(attributes.year.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.win_open_date).toBeDefined()
    expect(attributes.win_open_date.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.win_close_date).toBeDefined()
    expect(attributes.win_close_date.type.key).toBe(DataTypes.DATE.key)
  })

  test('should have correct options', () => {
    expect(etlStageAppsTypes.options.tableName).toBe('etl_stage_apps_types')
    expect(etlStageAppsTypes.options.freezeTableName).toBe(true)
    expect(etlStageAppsTypes.options.timestamps).toBe(false)
  })
})
