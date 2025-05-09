const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageTclcPiiPayClaimSfimtOption')

describe('etlStageTclcPiiPayClaimSfimtOption Model', () => {
  let etlStageTclcPiiPayClaimSfimtOption

  beforeAll(() => {
    etlStageTclcPiiPayClaimSfimtOption = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageTclcPiiPayClaimSfimtOption.getTableName().name).toBe('etlStageTclcPiiPayClaimSfimtOption')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageTclcPiiPayClaimSfimtOption.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.tclcPiiPayClaimSfimtOptionWid).toBeDefined()
    expect(attributes.tclcPiiPayClaimSfimtOptionWid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.applicationId).toBeDefined()
    expect(attributes.applicationId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.calculationId).toBeDefined()
    expect(attributes.calculationId.type.key).toBe(DataTypes.INTEGER.key)
  })

  test('should have correct options', () => {
    expect(etlStageTclcPiiPayClaimSfimtOption.options.tableName).toBe('etlStageTclcPiiPayClaimSfimtOption')
    expect(etlStageTclcPiiPayClaimSfimtOption.options.freezeTableName).toBe(true)
    expect(etlStageTclcPiiPayClaimSfimtOption.options.timestamps).toBe(false)
  })
})
