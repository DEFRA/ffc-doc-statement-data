module.exports = (sequelize, DataTypes) => {
  const etlStageAppsTypes = sequelize.define('etlStageAppsTypes', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    appTypeId: DataTypes.INTEGER,
    sectorPCode: DataTypes.STRING,
    sectorSCode: DataTypes.STRING,
    shortDescription: DataTypes.STRING,
    extDescription: DataTypes.STRING,
    year: DataTypes.INTEGER,
    winOpenDate: DataTypes.DATE,
    winCloseDate: DataTypes.DATE
  },
  {
    tableName: 'etlStageAppsTypes',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageAppsTypes
}
