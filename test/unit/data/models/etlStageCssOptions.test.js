const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageCssOptions')

describe('etlStageCssOptions Model', () => {
  let etlStageCssOptions

  beforeAll(() => {
    etlStageCssOptions = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageCssOptions.getTableName()).toBe('etl_stage_css_options')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageCssOptions.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.css_option_id).toBeDefined()
    expect(attributes.css_option_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.option_type_id).toBeDefined()
    expect(attributes.option_type_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.option_description).toBeDefined()
    expect(attributes.option_description.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.option_long_description).toBeDefined()
    expect(attributes.option_long_description.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.duration).toBeDefined()
    expect(attributes.duration.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.option_code).toBeDefined()
    expect(attributes.option_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.contract_type_id).toBeDefined()
    expect(attributes.contract_type_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.start_dt).toBeDefined()
    expect(attributes.start_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.end_dt).toBeDefined()
    expect(attributes.end_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.group_id).toBeDefined()
    expect(attributes.group_id.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageCssOptions.options.tableName).toBe('etl_stage_css_options')
    expect(etlStageCssOptions.options.freezeTableName).toBe(true)
    expect(etlStageCssOptions.options.timestamps).toBe(false)
  })
})
