module.exports = (sequelize, DataTypes) => {
  const etlStageLog = sequelize.define('etlStageLog', {
    etl_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    etl_inserted_dt: DataTypes.DATE,
    file: DataTypes.STRING,
    started_at: DataTypes.DATE,
    ended_at: DataTypes.DATE,
    row_count: DataTypes.INTEGER,
    rows_loaded_count: DataTypes.INTEGER,
    id_from: DataTypes.INTEGER,
    id_to: DataTypes.INTEGER
  },
  {
    tableName: 'etl_stage_log',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageLog
}
