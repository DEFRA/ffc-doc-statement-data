const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const commentDate = 'Example Output:  2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlIntermApplicationContract = sequelize.define('etlIntermApplicationContract', {
    contractId: {
      type: DataTypes.INTEGER,
      comment
    },
    agreementStart: {
      type: DataTypes.DATE,
      comment: commentDate
    },
    agreementEnd: {
      type: DataTypes.DATE,
      comment: commentDate
    },
    applicationId: {
      type: DataTypes.INTEGER,
      comment
    },
    pkid: {
      type: DataTypes.INTEGER,
      comment
    },
    etlInsertedDt: {
      type: DataTypes.DATE,
      comment: commentDate
    }
  }, {
    tableName: 'etlIntermApplicationContract',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermApplicationContract
}
