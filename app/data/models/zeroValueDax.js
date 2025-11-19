const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { commentDateCreated } = require('../../constants/field-comments')

module.exports = (sequelize, DataTypes) => {
  const PAYMENT_REFERENCE_LENGTH = 30
  const PAYMENT_PERIOD_LENGTH = 200
  const zeroValueDax = sequelize.define('zeroValueDax', {
    daxId: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    paymentReference: { type: DataTypes.STRING(PAYMENT_REFERENCE_LENGTH), allowNull: false },
    calculationId: { type: DataTypes.INTEGER },
    paymentPeriod: { type: DataTypes.STRING(PAYMENT_PERIOD_LENGTH), allowNull: true },
    paymentAmount: { type: DataTypes.DECIMAL, allowNull: false },
    transactionDate: { type: DataTypes.DATE, allowNull: false },
    dateCreated: { type: DataTypes.DATE, allowNull: false, comment: commentDateCreated },
    alertSent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    tableName: 'zeroValueDax',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return zeroValueDax
}
