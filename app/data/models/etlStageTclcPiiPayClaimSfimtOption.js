const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageTclcPiiPayClaimSfimtOption = sequelize.define('etlStageTclcPiiPayClaimSfimtOption', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    tclcPiiPayClaimSfimtOptionWid: DataTypes.INTEGER,
    applicationId: DataTypes.INTEGER,
    calculationId: DataTypes.INTEGER
  },
  {
    tableName: 'etlStageTclcPiiPayClaimSfimtOption',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageTclcPiiPayClaimSfimtOption
}
