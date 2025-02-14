const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageCssContractApplications')

describe('etlStageCssContractApplications Model', () => {
  let etlStageCssContractApplications

  beforeAll(() => {
    etlStageCssContractApplications = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageCssContractApplications.getTableName()).toBe('etl_stage_css_contract_applications')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageCssContractApplications.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.css_contract_application_wid).toBeDefined()
    expect(attributes.css_contract_application_wid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.pkid).toBeDefined()
    expect(attributes.pkid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.insert_dt).toBeDefined()
    expect(attributes.insert_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.delete_dt).toBeDefined()
    expect(attributes.delete_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.contract_id).toBeDefined()
    expect(attributes.contract_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.application_id).toBeDefined()
    expect(attributes.application_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.type_p_code).toBeDefined()
    expect(attributes.type_p_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.type_s_code).toBeDefined()
    expect(attributes.type_s_code.type.key).toBe(DataTypes.STRING.key)

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
    expect(etlStageCssContractApplications.options.tableName).toBe('etl_stage_css_contract_applications')
    expect(etlStageCssContractApplications.options.freezeTableName).toBe(true)
    expect(etlStageCssContractApplications.options.timestamps).toBe(false)
  })
})
