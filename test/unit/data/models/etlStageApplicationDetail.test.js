const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('f::memory:')

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
    expect(attributes.etl_id.type).toBe(DataTypes.INTEGER)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type).toBe(DataTypes.DATE)

    expect(attributes.pkid).toBeDefined()
    expect(attributes.pkid.type).toBe(DataTypes.INTEGER)

    expect(attributes.dt_insert).toBeDefined()
    expect(attributes.dt_insert.type).toBe(DataTypes.DATE)

    expect(attributes.dt_delete).toBeDefined()
    expect(attributes.dt_delete.type).toBe(DataTypes.DATE)

    expect(attributes.subject_id).toBeDefined()
    expect(attributes.subject_id.type).toBe(DataTypes.INTEGER)

    expect(attributes.ute_id).toBeDefined()
    expect(attributes.ute_id.type).toBe(DataTypes.INTEGER)

    expect(attributes.application_id).toBeDefined()
    expect(attributes.application_id.type).toBe(DataTypes.INTEGER)

    expect(attributes.application_code).toBeDefined()
    expect(attributes.application_code.type).toBe(DataTypes.STRING)

    expect(attributes.amended_app_id).toBeDefined()
    expect(attributes.amended_app_id.type).toBe(DataTypes.INTEGER)

    expect(attributes.app_type_id).toBeDefined()
    expect(attributes.app_type_id.type).toBe(DataTypes.INTEGER)

    expect(attributes.proxy_id).toBeDefined()
    expect(attributes.proxy_id.type).toBe(DataTypes.INTEGER)

    expect(attributes.status_p_code).toBeDefined()
    expect(attributes.status_p_code.type).toBe(DataTypes.STRING)

    expect(attributes.status_s_code).toBeDefined()
    expect(attributes.status_s_code.type).toBe(DataTypes.STRING)

    expect(attributes.source_p_code).toBeDefined()
    expect(attributes.source_p_code.type).toBe(DataTypes.STRING)

    expect(attributes.source_s_code).toBeDefined()
    expect(attributes.source_s_code.type).toBe(DataTypes.STRING)

    expect(attributes.dt_start).toBeDefined()
    expect(attributes.dt_start.type).toBe(DataTypes.STRING)

    expect(attributes.dt_end).toBeDefined()
    expect(attributes.dt_end.type).toBe(DataTypes.STRING)

    expect(attributes.valid_start_flg).toBeDefined()
    expect(attributes.valid_start_flg.type).toBe(DataTypes.STRING)

    expect(attributes.valid_end_flg).toBeDefined()
    expect(attributes.valid_end_flg.type).toBe(DataTypes.STRING)

    expect(attributes.app_id_start).toBeDefined()
    expect(attributes.app_id_start.type).toBe(DataTypes.INTEGER)

    expect(attributes.app_id_end).toBeDefined()
    expect(attributes.app_id_end.type).toBe(DataTypes.INTEGER)

    expect(attributes.dt_rec_update).toBeDefined()
    expect(attributes.dt_rec_update.type).toBe(DataTypes.DATE)

    expect(attributes.user_id).toBeDefined()
    expect(attributes.user_id.type).toBe(DataTypes.STRING)
  })

  test('should have correct options', () => {
    expect(etlStageApplicationDetail.options.tableName).toBe('etl_stage_application_detail')
    expect(etlStageApplicationDetail.options.freezeTableName).toBe(true)
    expect(etlStageApplicationDetail.options.timestamps).toBe(false)
  })
})
