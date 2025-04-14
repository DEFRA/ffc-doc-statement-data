const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageBusinessAddressContactV = sequelize.define('etlStageBusinessAddressContactV', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    sbi: DataTypes.INTEGER,
    frn: DataTypes.STRING,
    businessName: DataTypes.STRING,
    businessAddress1: DataTypes.STRING,
    businessAddress2: DataTypes.STRING,
    businessAddress3: DataTypes.STRING,
    businessCity: DataTypes.STRING,
    businessCounty: DataTypes.STRING,
    businessPostCode: DataTypes.STRING,
    businessMobile: DataTypes.STRING,
    businessEmailAddr: DataTypes.STRING
  },
  {
    tableName: 'etlStageBusinessAddressContactV',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageBusinessAddressContactV
}
