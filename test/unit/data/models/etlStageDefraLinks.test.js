const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageDefraLinks')

describe('etlStageDefraLinks Model', () => {
  let etlStageDefraLinks

  beforeAll(() => {
    etlStageDefraLinks = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageDefraLinks.getTableName()).toBe('etl_stage_defra_links')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageDefraLinks.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.defra_links_wid).toBeDefined()
    expect(attributes.defra_links_wid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.subject_id).toBeDefined()
    expect(attributes.subject_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.defra_id).toBeDefined()
    expect(attributes.defra_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.defra_type).toBeDefined()
    expect(attributes.defra_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.mdm_id).toBeDefined()
    expect(attributes.mdm_id.type.key).toBe(DataTypes.INTEGER.key)
  })

  test('should have correct options', () => {
    expect(etlStageDefraLinks.options.tableName).toBe('etl_stage_defra_links')
    expect(etlStageDefraLinks.options.freezeTableName).toBe(true)
    expect(etlStageDefraLinks.options.timestamps).toBe(false)
  })
})
