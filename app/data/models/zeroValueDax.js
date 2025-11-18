const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

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
    dateCreated: { type: DataTypes.DATE, allowNull: false, comment: "Example Output: 2025-05-12 15:08:08.664 Source: Documents. Used on Statement? No, Used to alert users when a zero value or negative value statement is produced" },
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
