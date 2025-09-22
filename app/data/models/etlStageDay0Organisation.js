const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const etlStageDay0Organisation = (sequelize, DataTypes) => {
  const etlStageDay0Organisation = sequelize.define('etlStageDay0Organisation', {
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    organisationWid: DataTypes.INTEGER,
    partyId: DataTypes.INTEGER,
    sbi: DataTypes.INTEGER,
    lastUpdatedOn: DataTypes.DATE
  },
  {
    tableName: 'etlStageDay0Organisation',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageDay0Organisation
}

module.exports = etlStageDay0Organisation
