const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageCssContracts')

describe('etlStageCssContracts Model', () => {
  let etlStageCssContracts

  beforeAll(() => {
    etlStageCssContracts = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageCssContracts.getTableName()).toBe('etl_stage_css_contracts')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageCssContracts.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.css_contract_wid).toBeDefined()
    expect(attributes.css_contract_wid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.pkid).toBeDefined()
    expect(attributes.pkid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.insert_dt).toBeDefined()
    expect(attributes.insert_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.delete_dt).toBeDefined()
    expect(attributes.delete_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.contract_id).toBeDefined()
    expect(attributes.contract_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.contract_code).toBeDefined()
    expect(attributes.contract_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.contract_type_id).toBeDefined()
    expect(attributes.contract_type_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.contract_type_description).toBeDefined()
    expect(attributes.contract_type_description.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.contract_description).toBeDefined()
    expect(attributes.contract_description.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.contract_state_p_code).toBeDefined()
    expect(attributes.contract_state_p_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.contract_state_s_code).toBeDefined()
    expect(attributes.contract_state_s_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.data_source_p_code).toBeDefined()
    expect(attributes.data_source_p_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.data_source_s_code).toBeDefined()
    expect(attributes.data_source_s_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.start_dt).toBeDefined()
    expect(attributes.start_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.end_dt).toBeDefined()
    expect(attributes.end_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.valid_start_flag).toBeDefined()
    expect(attributes.valid_start_flag.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.valid_end_flag).toBeDefined()
    expect(attributes.valid_end_flag.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.start_act_id).toBeDefined()
    expect(attributes.start_act_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.end_act_id).toBeDefined()
    expect(attributes.end_act_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.last_update_dt).toBeDefined()
    expect(attributes.last_update_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.user).toBeDefined()
    expect(attributes.user.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageCssContracts.options.tableName).toBe('etl_stage_css_contracts')
    expect(etlStageCssContracts.options.freezeTableName).toBe(true)
    expect(etlStageCssContracts.options.timestamps).toBe(false)
  })
})
