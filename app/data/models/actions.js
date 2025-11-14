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
    actionId: { type: DataTypes.INTEGER, primaryKey: true, comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    calculationId: { type: DataTypes.INTEGER, comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    fundingCode: { type: DataTypes.STRING(FUNDING_CODE_LENGTH), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    groupName: { type: DataTypes.STRING(GROUP_NAME_LENGTH), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    actionCode: { type: DataTypes.STRING(ACTION_CODE_LENGTH), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    actionName: { type: DataTypes.STRING(ACTION_NAME_LENGTH), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    rate: { type: DataTypes.STRING(RATE_LENGTH), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    landArea: { type: DataTypes.DECIMAL(LAND_AREA_PRECISION, LAND_AREA_SCALE), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    uom: { type: DataTypes.STRING(UOM_LENGTH), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    annualValue: { type: DataTypes.STRING(ANNUAL_VALUE_LENGTH), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    quarterlyValue: { type: DataTypes.DECIMAL(DECIMAL_SCALE, DECIMAL_PRECISION), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    overDeclarationPenalty: { type: DataTypes.DECIMAL(DECIMAL_SCALE, DECIMAL_PRECISION), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    quarterlyPaymentAmount: { type: DataTypes.DECIMAL(DECIMAL_SCALE, DECIMAL_PRECISION), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    datePublished: { type: DataTypes.DATE, allowNull: true, comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' }
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
