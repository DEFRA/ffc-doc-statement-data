const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageCalculationDetails')

describe('etlStageCalculationDetails Model', () => {
  let etlStageCalculationDetails

  beforeAll(() => {
    etlStageCalculationDetails = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageCalculationDetails.getTableName().name).toBe('etlStageCalculationDetails')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageCalculationDetails.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.applicationId).toBeDefined()
    expect(attributes.applicationId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.idClcHeader).toBeDefined()
    expect(attributes.idClcHeader.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.calculationId).toBeDefined()
    expect(attributes.calculationId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.calculationDt).toBeDefined()
    expect(attributes.calculationDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.ranked).toBeDefined()
    expect(attributes.ranked.type.key).toBe(DataTypes.INTEGER.key)
  })

  test('should have correct options', () => {
    expect(etlStageCalculationDetails.options.tableName).toBe('etlStageCalculationDetails')
    expect(etlStageCalculationDetails.options.freezeTableName).toBe(true)
    expect(etlStageCalculationDetails.options.timestamps).toBe(false)
  })
})
