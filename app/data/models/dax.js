const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const PAYMENT_REFERENCE_LENGTH = 30
  const PAYMENT_PERIOD_LENGTH = 200
  const dax = sequelize.define('dax', {
    daxId: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, comment: 'Example Output: 1 Source: DWH | DAX Used on Statement? No, Required as the primary key' },
    paymentReference: { type: DataTypes.STRING(PAYMENT_REFERENCE_LENGTH), allowNull: false, comment: "Example Output: RC200820242 Source: DWH | DAX Used on Statement? Yes  Payment Summary. Reference used on remittance and user's bank statement" },
    calculationId: { type: DataTypes.INTEGER, comment: 'Example Output: 120240820 Source: DWH | DAX Used on Statement? No, Required to join data. ID of calculation details and used to join data.' },
    paymentPeriod: { type: DataTypes.STRING(PAYMENT_PERIOD_LENGTH), allowNull: true, comment: 'Example Output: Q4-24 Source: DWH | DAX Used on Statement? No, Retained as potentially useful for schedules in future' },
    paymentAmount: { type: DataTypes.DECIMAL, allowNull: false, comment: 'Example Output: -500 Source: DWH | DAX Used on Statement? Yes, Payment Summary. Amount paid to the customer for this payment instalment' },
    transactionDate: { type: DataTypes.DATE, allowNull: false, comment: 'Example Output: 2024-02-09 00:00:00 Source: DWH | DAX Used on Statement? Yes, Payment Summary, Opening Details.  Date the payment was made to the customer' },
    datePublished: { type: DataTypes.DATE, allowNull: true, comment: 'Example Output: 2025-05-12 15:08:08.776 Source: Documents. Used on Statement? No, Used for ETL Logic. Used to determine if a statement has been generated' }
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
