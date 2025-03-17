module.exports = (sequelize, DataTypes) => {
  const etlStageDefraLinks = sequelize.define('etlStageDefraLinks', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    defraLinksWid: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
    defraId: DataTypes.INTEGER,
    defraType: DataTypes.STRING,
    mdmId: DataTypes.INTEGER
  },
  {
    tableName: 'etlStageDefraLinks',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageDefraLinks
}
