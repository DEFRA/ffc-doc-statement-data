module.exports = (sequelize, DataTypes) => {
  const number0 = 0
  const number11 = 11
  const number16 = 16
  const number38 = 38

  const delinkedCalculation = sequelize.define('delinkedCalculation', {
    applicationId: { type: DataTypes.NUMBER(number11, number0), allowNull: false },
    calculationId: { type: DataTypes.NUMBER(number11, number0), primaryKey: true, allowNull: false },
    sbi: { type: DataTypes.NUMBER(number38, number0), allowNull: false },
    frn: { type: DataTypes.STRING(number16), allowNull: false },
    paymentBand1: { type: DataTypes.STRING, allowNull: false },
    paymentBand2: { type: DataTypes.STRING, allowNull: false },
    paymentBand3: { type: DataTypes.STRING, allowNull: false },
    paymentBand4: { type: DataTypes.STRING, allowNull: false },
    percentageReduction1: { type: DataTypes.STRING, allowNull: false },
    percentageReduction2: { type: DataTypes.STRING, allowNull: false },
    percentageReduction3: { type: DataTypes.STRING, allowNull: false },
    percentageReduction4: { type: DataTypes.STRING, allowNull: false },
    progressiveReductions1: { type: DataTypes.STRING, allowNull: false },
    progressiveReductions2: { type: DataTypes.STRING, allowNull: false },
    progressiveReductions3: { type: DataTypes.STRING, allowNull: false },
    progressiveReductions4: { type: DataTypes.STRING, allowNull: false },
    referenceAmount: { type: DataTypes.STRING, allowNull: false },
    totalProgressiveReduction: { type: DataTypes.STRING, allowNull: false },
    totalDelinkedPayment: { type: DataTypes.STRING, allowNull: false },
    paymentAmountCalculated: { type: DataTypes.STRING, allowNull: false }
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
