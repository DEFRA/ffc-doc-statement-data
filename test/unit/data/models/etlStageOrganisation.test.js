const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageOrganisation')

describe('etlStageOrganisation Model', () => {
  let etlStageOrganisation

  beforeAll(() => {
    etlStageOrganisation = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageOrganisation.getTableName()).toBe('etl_stage_organisation')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageOrganisation.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.organisation_wid).toBeDefined()
    expect(attributes.organisation_wid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.party_id).toBeDefined()
    expect(attributes.party_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.organisation_name).toBeDefined()
    expect(attributes.organisation_name.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.confirmed_flg).toBeDefined()
    expect(attributes.confirmed_flg.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.land_confirmed_flg).toBeDefined()
    expect(attributes.land_confirmed_flg.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.sbi).toBeDefined()
    expect(attributes.sbi.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.tax_registration_number).toBeDefined()
    expect(attributes.tax_registration_number.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.legal_status_type_id).toBeDefined()
    expect(attributes.legal_status_type_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.business_reference).toBeDefined()
    expect(attributes.business_reference.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.business_type_id).toBeDefined()
    expect(attributes.business_type_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.vendor_number).toBeDefined()
    expect(attributes.vendor_number.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.land_details_confirmed_dt_key).toBeDefined()
    expect(attributes.land_details_confirmed_dt_key.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.business_det_confirmed_dt_key).toBeDefined()
    expect(attributes.business_det_confirmed_dt_key.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.registration_date).toBeDefined()
    expect(attributes.registration_date.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.charity_commission_regnum).toBeDefined()
    expect(attributes.charity_commission_regnum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.companies_house_regnum).toBeDefined()
    expect(attributes.companies_house_regnum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.additional_businesses).toBeDefined()
    expect(attributes.additional_businesses.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.amended).toBeDefined()
    expect(attributes.amended.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.trader_number).toBeDefined()
    expect(attributes.trader_number.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.date_started_farming).toBeDefined()
    expect(attributes.date_started_farming.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.accountable_people_completed).toBeDefined()
    expect(attributes.accountable_people_completed.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.financial_to_business_addr).toBeDefined()
    expect(attributes.financial_to_business_addr.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.corr_as_business_addr).toBeDefined()
    expect(attributes.corr_as_business_addr.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.last_updated_on).toBeDefined()
    expect(attributes.last_updated_on.type.key).toBe(DataTypes.DATE.key)
  })

  test('should have correct options', () => {
    expect(etlStageOrganisation.options.tableName).toBe('etl_stage_organisation')
    expect(etlStageOrganisation.options.freezeTableName).toBe(true)
    expect(etlStageOrganisation.options.timestamps).toBe(false)
  })
})
