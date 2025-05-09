const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const properties = {
  tableName: 'etlStageFinanceDax',
  freezeTableName: true,
  timestamps: false,
  schema: dbConfig.schema
}

const fields1 = (DataTypes) => ({
  changeType: DataTypes.STRING,
  changeTime: DataTypes.DATE,
  etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  etlInsertedDt: DataTypes.DATE,
  financeDaxWid: DataTypes.INTEGER,
  transdate: DataTypes.DATE,
  invoiceid: DataTypes.STRING,
  scheme: DataTypes.STRING,
  fund: DataTypes.STRING,
  marketingyear: DataTypes.STRING,
  accountnum: DataTypes.STRING,
  settlementvoucher: DataTypes.STRING,
  lineamountmstgbp: DataTypes.DECIMAL,
  month: DataTypes.STRING,
  amountmstgbp: DataTypes.DECIMAL,
  quarter: DataTypes.STRING,
  custvendac: DataTypes.STRING
})

const fields2 = (DataTypes) => ({
  recid: DataTypes.INTEGER,
  agreementreference: DataTypes.STRING,
  schemetype: DataTypes.INTEGER
})

const databaseFields = (DataTypes) => ({
  ...fields1(DataTypes),
  ...fields2(DataTypes)
})

module.exports = (sequelize, DataTypes) => {
  const etlStageFinanceDax = sequelize.define('etlStageFinanceDax', databaseFields(DataTypes), properties)
  return etlStageFinanceDax
}
