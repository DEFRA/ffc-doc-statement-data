const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = "Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"
const commentDate = "Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"

const properties = {
  tableName: 'etlStageFinanceDax',
  freezeTableName: true,
  timestamps: false,
  schema: dbConfig.schema
}

const fields1 = (DataTypes) => ({
  changeType: { type: DataTypes.STRING, comment },
  changeTime: { type: DataTypes.DATE, comment: commentDate},
  etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, comment },
  etlInsertedDt: { type: DataTypes.DATE, comment: commentDate},
  financeDaxWid: { type: DataTypes.INTEGER, comment },
  transdate: { type: DataTypes.DATE, comment: commentDate},
  invoiceid: { type: DataTypes.STRING, comment },
  scheme: { type: DataTypes.STRING, comment },
  fund: { type: DataTypes.STRING, comment },
  marketingyear: { type: DataTypes.STRING, comment },
  accountnum: { type: DataTypes.STRING, comment },
  settlementvoucher: { type: DataTypes.STRING, comment },
  lineamountmstgbp: DataTypes.DECIMAL,
  month: { type: DataTypes.STRING, comment },
  amountmstgbp: DataTypes.DECIMAL,
  quarter: { type: DataTypes.STRING, comment },
  custvendac: { type: DataTypes.STRING, comment }
})

const fields2 = (DataTypes) => ({
  recid: { type: DataTypes.INTEGER, comment },
  agreementreference: { type: DataTypes.STRING, comment },
  schemetype: { type: DataTypes.INTEGER, comment }
})

const databaseFields = (DataTypes) => ({
  ...fields1(DataTypes),
  ...fields2(DataTypes)
})

module.exports = (sequelize, DataTypes) => {
  const etlStageFinanceDax = sequelize.define('etlStageFinanceDax', databaseFields(DataTypes), properties)
  return etlStageFinanceDax
}
