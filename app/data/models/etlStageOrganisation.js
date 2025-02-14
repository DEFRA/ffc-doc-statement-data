module.exports = (sequelize, DataTypes) => {
  const etlStageOrganisation = sequelize.define('etlStageOrganisation', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    organisation_wid: DataTypes.INTEGER,
    party_id: DataTypes.INTEGER,
    organisation_name: DataTypes.STRING,
    confirmed_flg: DataTypes.INTEGER,
    land_confirmed_flg: DataTypes.INTEGER,
    sbi: DataTypes.INTEGER,
    tax_registration_number: DataTypes.STRING,
    legal_status_type_id: DataTypes.INTEGER,
    business_reference: DataTypes.STRING,
    business_type_id: DataTypes.INTEGER,
    vendor_number: DataTypes.STRING,
    land_details_confirmed_dt_key: DataTypes.INTEGER,
    business_det_confirmed_dt_key: DataTypes.INTEGER,
    registration_date: DataTypes.STRING,
    charity_commission_regnum: DataTypes.STRING,
    companies_house_regnum: DataTypes.STRING,
    additional_businesses: DataTypes.INTEGER,
    amended: DataTypes.INTEGER,
    trader_number: DataTypes.STRING,
    date_started_farming: DataTypes.STRING,
    accountable_people_completed: DataTypes.INTEGER,
    financial_to_business_addr: DataTypes.INTEGER,
    corr_as_business_addr: DataTypes.INTEGER,
    last_updated_on: DataTypes.DATE
  },
  {
    tableName: 'etl_stage_organisation',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageOrganisation
}
