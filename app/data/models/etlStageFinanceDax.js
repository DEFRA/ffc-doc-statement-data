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
  accountype: DataTypes.INTEGER,
  invoiceid: DataTypes.STRING,
  invoicedate: DataTypes.DATE,
  scheme: DataTypes.STRING,
  fund: DataTypes.STRING,
  marketingyear: DataTypes.STRING,
  accountnum: DataTypes.STRING,
  deliverybody: DataTypes.STRING,
  accrualstatus: DataTypes.INTEGER,
  settlementvoucher: DataTypes.STRING,
  lineamounteur: DataTypes.DECIMAL,
  lineamountmstgbp: DataTypes.DECIMAL,
  transactiontype: DataTypes.INTEGER,
  journalnum: DataTypes.STRING,
  journalname: DataTypes.STRING,
  admindebt: DataTypes.INTEGER,
  voucher: DataTypes.STRING,
  month: DataTypes.STRING,
  amounteur: DataTypes.DECIMAL,
  amountmstgbp: DataTypes.DECIMAL,
  quarter: DataTypes.STRING,
  idvoucher: DataTypes.STRING,
  transtxt: DataTypes.STRING,
  irregularitydebt: DataTypes.INTEGER,
  sectiontype: DataTypes.INTEGER,
  transrecid: DataTypes.INTEGER,
  ljtransrecid: DataTypes.INTEGER,
  glaccountentryrecid: DataTypes.INTEGER,
  settlementrecid: DataTypes.INTEGER,
  runnumber: DataTypes.STRING,
  reportingtype: DataTypes.INTEGER,
  custvendac: DataTypes.STRING,
  modifieddatetime: DataTypes.DATE,
  modifiedby: DataTypes.STRING
})

const fields2 = (DataTypes) => ({
  createddatetime: DataTypes.DATE,
  createdby: DataTypes.STRING,
  dataareaid: DataTypes.STRING,
  partition: DataTypes.STRING,
  recid: DataTypes.INTEGER,
  eurunnumber: DataTypes.STRING,
  accrualledgerdimensionaccount: DataTypes.INTEGER,
  accrualgjaccountentryrecid: DataTypes.INTEGER,
  legacyfarmeraccount: DataTypes.STRING,
  claimsettlementdate: DataTypes.DATE,
  claimrefnum: DataTypes.STRING,
  iseurelevant: DataTypes.INTEGER,
  fundedby: DataTypes.INTEGER,
  euyearstartdate: DataTypes.DATE,
  euyearenddate: DataTypes.DATE,
  yearendrunnumber: DataTypes.STRING,
  reason: DataTypes.STRING,
  exchratecalctype: DataTypes.INTEGER,
  postingdate: DataTypes.DATE,
  datawarehouserunnum: DataTypes.STRING,
  crosscompliance: DataTypes.INTEGER,
  penalty: DataTypes.INTEGER,
  exchfundedeur: DataTypes.DECIMAL,
  exchfundedgbp: DataTypes.DECIMAL,
  festxnnum: DataTypes.STRING,
  festxnlinenum: DataTypes.INTEGER,
  advpayflag: DataTypes.INTEGER,
  daxinvoicenum: DataTypes.STRING,
  dwhtxntype: DataTypes.STRING,
  retention: DataTypes.INTEGER,
  dummyt104: DataTypes.INTEGER,
  f106gbp: DataTypes.DECIMAL,
  schemeexchangerate: DataTypes.DECIMAL,
  agreementreference: DataTypes.STRING,
  oedate: DataTypes.DATE,
  settlementvoucher1: DataTypes.STRING,
  annexiitranstype: DataTypes.INTEGER,
  bpallocationtype: DataTypes.INTEGER,
  schemetype: DataTypes.INTEGER,
  applicationreference: DataTypes.STRING
})

const databaseFields = (DataTypes) => ({
  ...fields1(DataTypes),
  ...fields2(DataTypes)
})

module.exports = (sequelize, DataTypes) => {
  const etlStageFinanceDax = sequelize.define('etlStageFinanceDax', databaseFields(DataTypes), properties)
  return etlStageFinanceDax
}
