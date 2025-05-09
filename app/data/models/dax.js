const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const PAYMENT_REFERENCE_LENGTH = 30
  const PAYMENT_PERIOD_LENGTH = 200
  const dax = sequelize.define('dax', {
    daxId: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    paymentReference: { type: DataTypes.STRING(PAYMENT_REFERENCE_LENGTH), allowNull: false },
    calculationId: { type: DataTypes.INTEGER },
    paymentPeriod: { type: DataTypes.STRING(PAYMENT_PERIOD_LENGTH), allowNull: true },
    paymentAmount: { type: DataTypes.DECIMAL, allowNull: false },
    transactionDate: { type: DataTypes.DATE, allowNull: false },
    datePublished: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: 'dax',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  dax.associate = function (models) {
    dax.belongsTo(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
  }
  return dax
}
