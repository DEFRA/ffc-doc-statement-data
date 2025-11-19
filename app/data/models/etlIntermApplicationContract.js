const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlIntermApplicationContract = sequelize.define('etlIntermApplicationContract', {
    contractId: { type: DataTypes.INTEGER, comment: 'Example Output:  2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format' },
    agreementStart: { type: DataTypes.DATE, comment: 'Example Output:  2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format' },
    agreementEnd: { type: DataTypes.DATE, comment: 'Example Output:  2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format' },
    applicationId: { type: DataTypes.INTEGER, comment: 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format' },
    pkid: { type: DataTypes.INTEGER, comment: 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format' },
    etlInsertedDt: { type: DataTypes.DATE, comment: 'Example Output:  2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format' }
  }, {
    tableName: 'etlIntermApplicationContract',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermApplicationContract
}
