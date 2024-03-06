module.exports = (sequelize, DataTypes) => {
  const number2 = 2
  const number5 = 5
  const number6 = 6
  const number10 = 10
  const number15 = 15
  const number18 = 18
  const number50 = 50
  const number100 = 100

  const action = sequelize.define('action', {
    pkId: { type: DataTypes.INTEGER, primaryKey: true },
    calculationId: DataTypes.INTEGER,
    fundingCode: DataTypes.STRING(number5),
    groupName: DataTypes.STRING(number100),
    actionCode: DataTypes.STRING(number5),
    actionName: DataTypes.STRING(number100),
    rate: DataTypes.STRING(number50),
    landArea: DataTypes.DECIMAL(number18, number6),
    uom: DataTypes.STRING(number10),
    annualValue: DataTypes.STRING(number50),
    quarterlyValue: DataTypes.DECIMAL(number15, number2),
    overDeclarationPenalty: DataTypes.DECIMAL(number15, number2),
    quarterlyPaymentAmount: DataTypes.DECIMAL(number15, number2),
    datePublished: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: 'actions',
    freezeTableName: true,
    timestamps: false
  })
  action.associate = function (models) {
    action.belongsTo(models.total, {
      foreignKey: 'calculationId',
      as: 'actions'
    })
  }
  return action
}
