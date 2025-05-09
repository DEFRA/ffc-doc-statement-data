const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const DECIMAL_PRECISION = 2
  const DECIMAL_SCALE = 15
  const LAND_AREA_PRECISION = 18
  const LAND_AREA_SCALE = 6
  const FUNDING_CODE_LENGTH = 5
  const GROUP_NAME_LENGTH = 100
  const ACTION_CODE_LENGTH = 5
  const ACTION_NAME_LENGTH = 100
  const RATE_LENGTH = 100
  const UOM_LENGTH = 10
  const ANNUAL_VALUE_LENGTH = 50

  const action = sequelize.define('action', {
    actionId: { type: DataTypes.INTEGER, primaryKey: true },
    calculationId: DataTypes.INTEGER,
    fundingCode: DataTypes.STRING(FUNDING_CODE_LENGTH),
    groupName: DataTypes.STRING(GROUP_NAME_LENGTH),
    actionCode: DataTypes.STRING(ACTION_CODE_LENGTH),
    actionName: DataTypes.STRING(ACTION_NAME_LENGTH),
    rate: DataTypes.STRING(RATE_LENGTH),
    landArea: DataTypes.DECIMAL(LAND_AREA_PRECISION, LAND_AREA_SCALE),
    uom: DataTypes.STRING(UOM_LENGTH),
    annualValue: DataTypes.STRING(ANNUAL_VALUE_LENGTH),
    quarterlyValue: DataTypes.DECIMAL(DECIMAL_SCALE, DECIMAL_PRECISION),
    overDeclarationPenalty: DataTypes.DECIMAL(DECIMAL_SCALE, DECIMAL_PRECISION),
    quarterlyPaymentAmount: DataTypes.DECIMAL(DECIMAL_SCALE, DECIMAL_PRECISION),
    datePublished: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: 'actions',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  action.associate = function (models) {
    action.belongsTo(models.total, {
      foreignKey: 'calculationId',
      as: 'actions'
    })
  }
  return action
}
