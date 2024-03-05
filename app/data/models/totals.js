module.exports = (sequelize, DataTypes) => {
  const total = sequelize.define('total', {
    calculationId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    sbi: { type: DataTypes.INTEGER, allowNull: false },
    frn: { type: DataTypes.DECIMAL, allowNull: false },
    agreementNumber: { type: DataTypes.INTEGER, allowNull: false },
    claimId: { type: DataTypes.INTEGER, allowNull: false },
    schemeType: { type: DataTypes.STRING(50), allowNull: false },
    calculationDate: { type: DataTypes.DATE, allowNull: false },
    invoiceNumber: { type: DataTypes.STRING(20), allowNull: false },
    agreementStart: { type: DataTypes.DATE, allowNull: false },
    agreementEnd: { type: DataTypes.DATE, allowNull: false },
    totalAdditionalPayments: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    totalActionPayments: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    updated: { type: DataTypes.DATE }
  },
  {
    tableName: 'totals',
    freezeTableName: true,
    timestamps: false
  })
  total.associate = function (models) {
    total.hasMany(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
    total.hasMany(models.action, {
      foreignKey: 'calculationId',
      as: 'actions'
    })
    total.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
  }
  return total
}
