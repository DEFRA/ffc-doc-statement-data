const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const subsetCounter = sequelize.define('subsetCounter', {
    scheme: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    sent: DataTypes.INTEGER
  },
  {
    tableName: 'subsetCounter',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return subsetCounter
}
