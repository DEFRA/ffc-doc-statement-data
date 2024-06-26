module.exports = (sequelize, DataTypes) => {
  const number2 = 2
  const number15 = 15
  const delinkedCalculation = sequelize.define('delinkedCalculation', {
    applicationId: { type: DataTypes.INTEGER, allowNull: false },
    calculationId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    sbi: { type: DataTypes.INTEGER, allowNull: false },
    frn: { type: DataTypes.BIGINT, allowNull: false },
    paymentBand1: { type: DataTypes.INTEGER, allowNull: false },
    paymentBand2: { type: DataTypes.INTEGER, allowNull: false },
    paymentBand3: { type: DataTypes.INTEGER, allowNull: false },
    paymentBand4: { type: DataTypes.INTEGER, allowNull: false },
    percentageReduction1: { type: DataTypes.INTEGER, allowNull: false },
    percentageReduction2: { type: DataTypes.INTEGER, allowNull: false },
    percentageReduction3: { type: DataTypes.INTEGER, allowNull: false },
    percentageReduction4: { type: DataTypes.INTEGER, allowNull: false },
    progressiveReductions1: { type: DataTypes.DECIMAL(number15, number2), allowNull: false },
    progressiveReductions2: { type: DataTypes.DECIMAL(number15, number2), allowNull: false },
    progressiveReductions3: { type: DataTypes.DECIMAL(number15, number2), allowNull: false },
    progressiveReductions4: { type: DataTypes.DECIMAL(number15, number2), allowNull: false },
    referenceAmount: { type: DataTypes.DECIMAL(number15, number2), allowNull: false },
    totalProgressiveReduction: { type: DataTypes.DECIMAL(number15, number2), allowNull: false },
    totalDelinkedPayment: { type: DataTypes.DECIMAL(number15, number2), allowNull: false },
    paymentAmountCalculated: { type: DataTypes.DECIMAL(number15, number2), allowNull: false }
  },
  {
    tableName: 'delinkedCalculation',
    freezeTableName: true,
    timestamps: false
  })
  delinkedCalculation.associate = function (models) {
    delinkedCalculation.hasMany(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
    delinkedCalculation.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
  }
  return delinkedCalculation
}
