const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageApplicationDetail')

describe('etlStageApplicationDetail Model', () => {
  let etlStageApplicationDetail

  beforeAll(() => {
    etlStageApplicationDetail = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageApplicationDetail.getTableName()).toBe('etl_stage_application_detail')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageApplicationDetail.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.pkid).toBeDefined()
    expect(attributes.pkid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.dt_insert).toBeDefined()
    expect(attributes.dt_insert.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.dt_delete).toBeDefined()
    expect(attributes.dt_delete.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.subject_id).toBeDefined()
    expect(attributes.subject_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.ute_id).toBeDefined()
    expect(attributes.ute_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.application_id).toBeDefined()
    expect(attributes.application_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.application_code).toBeDefined()
    expect(attributes.application_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.amended_app_id).toBeDefined()
    expect(attributes.amended_app_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.app_type_id).toBeDefined()
    expect(attributes.app_type_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.proxy_id).toBeDefined()
    expect(attributes.proxy_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.status_p_code).toBeDefined()
    expect(attributes.status_p_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.status_s_code).toBeDefined()
    expect(attributes.status_s_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.source_p_code).toBeDefined()
    expect(attributes.source_p_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.source_s_code).toBeDefined()
    expect(attributes.source_s_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.dt_start).toBeDefined()
    expect(attributes.dt_start.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.dt_end).toBeDefined()
    expect(attributes.dt_end.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.valid_start_flg).toBeDefined()
    expect(attributes.valid_start_flg.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.valid_end_flg).toBeDefined()
    expect(attributes.valid_end_flg.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.app_id_start).toBeDefined()
    expect(attributes.app_id_start.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.app_id_end).toBeDefined()
    expect(attributes.app_id_end.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.dt_rec_update).toBeDefined()
    expect(attributes.dt_rec_update.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.user_id).toBeDefined()
    expect(attributes.user_id.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageApplicationDetail.options.tableName).toBe('etl_stage_application_detail')
    expect(etlStageApplicationDetail.options.freezeTableName).toBe(true)
    expect(etlStageApplicationDetail.options.timestamps).toBe(false)
  })
})
