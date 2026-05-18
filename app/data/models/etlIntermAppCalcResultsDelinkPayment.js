const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const defineEtlIntermAppCalcResultsDelinkPayment = (sequelize, DataTypes) => {
  const FRN_LENGTH = 16

  const etlIntermAppCalcResultsDelinkPayment = sequelize.define('etlIntermAppCalcResultsDelinkPayment', {
    applicationId: { type: DataTypes.INTEGER, allowNull: false },
    calculationId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    sbi: { type: DataTypes.INTEGER, allowNull: false },
    frn: { type: DataTypes.STRING(FRN_LENGTH), allowNull: false },
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
    paymentAmountCalculated: { type: DataTypes.STRING, allowNull: false },
    etlInsertedDt: { type: DataTypes.DATE, comment: 'Example Output:  2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format' }
  },
  {
    tableName: 'etlIntermAppCalcResultsDelinkPayments',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlIntermAppCalcResultsDelinkPayment
}

module.exports = defineEtlIntermAppCalcResultsDelinkPayment
