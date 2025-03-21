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

    expect(attributes.opCode).toBeDefined()
    expect(attributes.opCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.scoUom).toBeDefined()
    expect(attributes.scoUom.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.commitment).toBeDefined()
    expect(attributes.commitment.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.commitmentVal).toBeDefined()
    expect(attributes.commitmentVal.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.agreeAmount).toBeDefined()
    expect(attributes.agreeAmount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.claimedPayAmount).toBeDefined()
    expect(attributes.claimedPayAmount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.verifyPayAmount).toBeDefined()
    expect(attributes.verifyPayAmount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.foundAmount).toBeDefined()
    expect(attributes.foundAmount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.overdReductAmount).toBeDefined()
    expect(attributes.overdReductAmount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.overdPenaltyAmount).toBeDefined()
    expect(attributes.overdPenaltyAmount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.net1Amount).toBeDefined()
    expect(attributes.net1Amount.type.key).toBe(DataTypes.DECIMAL.key)
  })

  test('should have correct options', () => {
    expect(etlStageTclcPiiPayClaimSfimtOption.options.tableName).toBe('etlStageTclcPiiPayClaimSfimtOption')
    expect(etlStageTclcPiiPayClaimSfimtOption.options.freezeTableName).toBe(true)
    expect(etlStageTclcPiiPayClaimSfimtOption.options.timestamps).toBe(false)
  })
})
