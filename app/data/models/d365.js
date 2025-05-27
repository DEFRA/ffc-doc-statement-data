const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const PAYMENT_REFERENCE_LENGTH = 30
  const PAYMENT_PERIOD_LENGTH = 200
  const marketingYearMinLength = 1000
  const marketingYearMaxLength = 9999
  const d365 = sequelize.define('d365', {
    d365Id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    paymentReference: { type: DataTypes.STRING(PAYMENT_REFERENCE_LENGTH), allowNull: false },
    marketingYear: { type: DataTypes.INTEGER(), allowNull: false, validate: { isInt: true, min: marketingYearMinLength, max: marketingYearMaxLength } },
    calculationId: { type: DataTypes.INTEGER },
    paymentPeriod: { type: DataTypes.STRING(PAYMENT_PERIOD_LENGTH), allowNull: true },
    paymentAmount: { type: DataTypes.DECIMAL, allowNull: false },
    transactionDate: { type: DataTypes.DATE, allowNull: false },
    datePublished: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: 'd365',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  d365.associate = function (models) {
    d365.belongsTo(models.delinkedCalculation, {
      foreignKey: 'calculationId',
      as: 'delinkedCalculation'
    })
  }
  return d365
}
