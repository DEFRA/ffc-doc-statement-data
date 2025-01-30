const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageTclcPiiPayClaimSfimtOption')

describe('etlStageTclcPiiPayClaimSfimtOption Model', () => {
  let etlStageTclcPiiPayClaimSfimtOption

  beforeAll(() => {
    etlStageTclcPiiPayClaimSfimtOption = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageTclcPiiPayClaimSfimtOption.getTableName()).toBe('etl_stage_tclc_pii_pay_claim_sfimt_option')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageTclcPiiPayClaimSfimtOption.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.tclc_pii_pay_claim_sfimt_option_wid).toBeDefined()
    expect(attributes.tclc_pii_pay_claim_sfimt_option_wid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.application_id).toBeDefined()
    expect(attributes.application_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.calculation_id).toBeDefined()
    expect(attributes.calculation_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.op_code).toBeDefined()
    expect(attributes.op_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.sco_uom).toBeDefined()
    expect(attributes.sco_uom.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.commitment).toBeDefined()
    expect(attributes.commitment.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.commitment_val).toBeDefined()
    expect(attributes.commitment_val.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.agree_amount).toBeDefined()
    expect(attributes.agree_amount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.claimed_pay_amount).toBeDefined()
    expect(attributes.claimed_pay_amount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.verify_pay_amount).toBeDefined()
    expect(attributes.verify_pay_amount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.found_amount).toBeDefined()
    expect(attributes.found_amount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.overd_reduct_amount).toBeDefined()
    expect(attributes.overd_reduct_amount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.overd_penalty_amount).toBeDefined()
    expect(attributes.overd_penalty_amount.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.net1_amount).toBeDefined()
    expect(attributes.net1_amount.type.key).toBe(DataTypes.DECIMAL.key)
  })

  test('should have correct options', () => {
    expect(etlStageTclcPiiPayClaimSfimtOption.options.tableName).toBe('etl_stage_tclc_pii_pay_claim_sfimt_option')
    expect(etlStageTclcPiiPayClaimSfimtOption.options.freezeTableName).toBe(true)
    expect(etlStageTclcPiiPayClaimSfimtOption.options.timestamps).toBe(false)
  })
})
