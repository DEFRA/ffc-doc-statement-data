const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageCalculationDetails')

describe('etlStageCalculationDetails Model', () => {
  let etlStageCalculationDetails

  beforeAll(() => {
    etlStageCalculationDetails = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageCalculationDetails.getTableName()).toBe('etl_stage_calculation_details')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageCalculationDetails.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.application_id).toBeDefined()
    expect(attributes.application_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.id_clc_header).toBeDefined()
    expect(attributes.id_clc_header.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.calculation_id).toBeDefined()
    expect(attributes.calculation_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.calculation_dt).toBeDefined()
    expect(attributes.calculation_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.ranked).toBeDefined()
    expect(attributes.ranked.type.key).toBe(DataTypes.INTEGER.key)
  })

  test('should have correct options', () => {
    expect(etlStageCalculationDetails.options.tableName).toBe('etl_stage_calculation_details')
    expect(etlStageCalculationDetails.options.freezeTableName).toBe(true)
    expect(etlStageCalculationDetails.options.timestamps).toBe(false)
  })
})
