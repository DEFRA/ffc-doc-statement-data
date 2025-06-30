const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const subsetCheck = sequelize.define('subsetCheck', {
    scheme: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    subsetSent: DataTypes.BOOLEAN
  },
  {
    tableName: 'subsetCheck',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return subsetCheck
}
