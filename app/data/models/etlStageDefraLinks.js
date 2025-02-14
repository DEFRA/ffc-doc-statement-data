module.exports = (sequelize, DataTypes) => {
  const etlStageDefraLinks = sequelize.define('etlStageDefraLinks', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    defra_links_wid: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    defra_id: DataTypes.INTEGER,
    defra_type: DataTypes.STRING,
    mdm_id: DataTypes.INTEGER
  },
  {
    tableName: 'etl_stage_defra_links',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageDefraLinks
}
