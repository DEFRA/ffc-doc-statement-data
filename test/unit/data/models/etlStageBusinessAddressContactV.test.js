const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageBusinessAddressContactV')

describe('etlStageBusinessAddressContactV Model', () => {
  let etlStageBusinessAddressContactV

  beforeAll(() => {
    etlStageBusinessAddressContactV = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageBusinessAddressContactV.getTableName()).toBe('etl_stage_business_address_contact_v')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageBusinessAddressContactV.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.sbi).toBeDefined()
    expect(attributes.sbi.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.frn).toBeDefined()
    expect(attributes.frn.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.business_name).toBeDefined()
    expect(attributes.business_name.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.accountable_people_completed).toBeDefined()
    expect(attributes.accountable_people_completed.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.financial_to_business_addr).toBeDefined()
    expect(attributes.financial_to_business_addr.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.corr_as_business_addr).toBeDefined()
    expect(attributes.corr_as_business_addr.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.business_address1).toBeDefined()
    expect(attributes.business_address1.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.business_address2).toBeDefined()
    expect(attributes.business_address2.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.business_address3).toBeDefined()
    expect(attributes.business_address3.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.business_city).toBeDefined()
    expect(attributes.business_city.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.business_county).toBeDefined()
    expect(attributes.business_county.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.business_post_code).toBeDefined()
    expect(attributes.business_post_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.business_landline).toBeDefined()
    expect(attributes.business_landline.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.business_mobile).toBeDefined()
    expect(attributes.business_mobile.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.business_email_addr).toBeDefined()
    expect(attributes.business_email_addr.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.correspondence_address1).toBeDefined()
    expect(attributes.correspondence_address1.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.correspondence_address2).toBeDefined()
    expect(attributes.correspondence_address2.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.correspondence_address3).toBeDefined()
    expect(attributes.correspondence_address3.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.correspondence_city).toBeDefined()
    expect(attributes.correspondence_city.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.correspondence_county).toBeDefined()
    expect(attributes.correspondence_county.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.correspondence_post_code).toBeDefined()
    expect(attributes.correspondence_post_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.correspondence_landline).toBeDefined()
    expect(attributes.correspondence_landline.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.correspondence_mobile).toBeDefined()
    expect(attributes.correspondence_mobile.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.correspondence_email_addr).toBeDefined()
    expect(attributes.correspondence_email_addr.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageBusinessAddressContactV.options.tableName).toBe('etl_stage_business_address_contact_v')
    expect(etlStageBusinessAddressContactV.options.freezeTableName).toBe(true)
    expect(etlStageBusinessAddressContactV.options.timestamps).toBe(false)
  })
})
