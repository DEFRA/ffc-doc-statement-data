module.exports = (sequelize, DataTypes) => {
  const dax = sequelize.define('dax', {
    paymentReference: { type: DataTypes.STRING(30), primaryKey: true, allowNull: false },
    calculationId: { type: DataTypes.INTEGER },
    paymentPeriod: { type: DataTypes.STRING(200), allowNull: false },
    totalQuarterlyPayment: { type: DataTypes.DECIMAL, allowNull: false },
    transDate: { type: DataTypes.DATE, allowNull: false }
  },
  {
    tableName: 'dax',
    freezeTableName: true,
    timestamps: false
  })
  dax.associate = function (models) {
    dax.belongsTo(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
  }
  return dax
}
