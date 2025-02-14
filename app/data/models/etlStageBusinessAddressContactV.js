module.exports = (sequelize, DataTypes) => {
  const etlStageBusinessAddressContactV = sequelize.define('etlStageBusinessAddressContactV', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    sbi: DataTypes.INTEGER,
    frn: DataTypes.STRING,
    business_name: DataTypes.STRING,
    accountable_people_completed: DataTypes.DECIMAL,
    financial_to_business_addr: DataTypes.DECIMAL,
    corr_as_business_addr: DataTypes.DECIMAL,
    business_address1: DataTypes.STRING,
    business_address2: DataTypes.STRING,
    business_address3: DataTypes.STRING,
    business_city: DataTypes.STRING,
    business_county: DataTypes.STRING,
    business_post_code: DataTypes.STRING,
    business_landline: DataTypes.STRING,
    business_mobile: DataTypes.STRING,
    business_email_addr: DataTypes.STRING,
    correspondence_address1: DataTypes.STRING,
    correspondence_address2: DataTypes.STRING,
    correspondence_address3: DataTypes.STRING,
    correspondence_city: DataTypes.STRING,
    correspondence_county: DataTypes.STRING,
    correspondence_post_code: DataTypes.STRING,
    correspondence_landline: DataTypes.STRING,
    correspondence_mobile: DataTypes.STRING,
    correspondence_email_addr: DataTypes.STRING
  },
  {
    tableName: 'etl_stage_business_address_contact_v',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageBusinessAddressContactV
}
