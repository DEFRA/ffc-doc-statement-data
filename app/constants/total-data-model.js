const DECIMAL_PRECISION = 2
const DECIMAL_SCALE = 15
const INVOICE_NUMBER_LENGTH = 20
const SCHEME_TYPE_LENGTH = 50

module.exports = (DataTypes) => ({
  calculationId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  sbi: { type: DataTypes.INTEGER, allowNull: false },
  frn: { type: DataTypes.BIGINT, allowNull: false },
  agreementNumber: { type: DataTypes.INTEGER, allowNull: false },
  claimId: { type: DataTypes.INTEGER, allowNull: false },
  schemeType: { type: DataTypes.STRING(SCHEME_TYPE_LENGTH), allowNull: false },
  calculationDate: { type: DataTypes.DATE, allowNull: false },
  invoiceNumber: { type: DataTypes.STRING(INVOICE_NUMBER_LENGTH), allowNull: false },
  agreementStart: { type: DataTypes.DATE, allowNull: false },
  agreementEnd: { type: DataTypes.DATE, allowNull: false },
  totalAdditionalPayments: { type: DataTypes.DECIMAL(DECIMAL_SCALE, DECIMAL_PRECISION), allowNull: false },
  totalActionPayments: { type: DataTypes.DECIMAL(DECIMAL_SCALE, DECIMAL_PRECISION), allowNull: false },
  totalPayments: { type: DataTypes.DECIMAL(DECIMAL_SCALE, DECIMAL_PRECISION), allowNull: false },
  updated: { type: DataTypes.DATE },
  datePublished: { type: DataTypes.DATE, allowNull: true }
})
