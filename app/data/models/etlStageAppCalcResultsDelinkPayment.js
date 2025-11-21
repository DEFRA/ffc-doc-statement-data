const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlStageAppCalcResultsDelinkPayment = sequelize.define('etlStageAppCalcResultsDelinkPayment', {
    changeType: { type: DataTypes.STRING, comment },
    changeTime: { type: DataTypes.DATE, commentDate },
    etlId: { type: DataTypes.INTEGER, comment },
    etlInsertedDt: { type: DataTypes.DATE, commentDate },
    calculationId: { type: DataTypes.INTEGER, comment },
    variableName: { type: DataTypes.STRING, comment },
    progLine: { type: DataTypes.INTEGER, comment },
    value: { type: DataTypes.STRING, comment }
  },
  {
    tableName: 'etlStageAppCalcResultsDelinkPayments',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageAppCalcResultsDelinkPayment
}
