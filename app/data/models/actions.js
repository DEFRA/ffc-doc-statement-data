module.exports = (sequelize, DataTypes) => {
  const action = sequelize.define('action', {
    pkId: { type: DataTypes.INTEGER, primaryKey: true },
    calculationId: DataTypes.INTEGER,
    fundingCode: DataTypes.STRING(5),
    groupName: DataTypes.STRING(100),
    actionCode: DataTypes.STRING(5),
    actionName: DataTypes.STRING(100),
    rate: DataTypes.STRING(50),
    landArea: DataTypes.DECIMAL(18, 6),
    uom: DataTypes.STRING(10),
    annualValue: DataTypes.STRING(50),
    quarterlyValue: DataTypes.DECIMAL(15, 2),
    overDeclarationPenalty: DataTypes.DECIMAL(15, 2),
    quarterlyPaymentAmount: DataTypes.DECIMAL(15, 2),
    datePublished: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: 'actions',
    freezeTableName: true,
    timestamps: false
  })
  action.associate = function (models) {
    action.belongsTo(models.action, {
      foreignKey: 'calculationId',
      as: 'actions'
    })
  }
  return action
}
