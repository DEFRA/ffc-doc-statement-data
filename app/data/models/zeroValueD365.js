const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const PAYMENT_REFERENCE_LENGTH = 30
  const PAYMENT_PERIOD_LENGTH = 200
  const marketingYearMinYear = 2023
  const marketingYearMaxYear = 2050
  const zeroValueD365 = sequelize.define('zeroValueD365', {
    d365Id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    paymentReference: { type: DataTypes.STRING(PAYMENT_REFERENCE_LENGTH), allowNull: false },
    marketingYear: { type: DataTypes.INTEGER(), allowNull: false, validate: { isInt: true, min: marketingYearMinYear, max: marketingYearMaxYear } },
    calculationId: { type: DataTypes.INTEGER },
    paymentPeriod: { type: DataTypes.STRING(PAYMENT_PERIOD_LENGTH), allowNull: true },
    paymentAmount: { type: DataTypes.DECIMAL, allowNull: false },
    transactionDate: { type: DataTypes.DATE, allowNull: false },
    dateCreated: { type: DataTypes.DATE, allowNull: false },
    alertSent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    tableName: 'zeroValueD365',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return zeroValueD365
}
