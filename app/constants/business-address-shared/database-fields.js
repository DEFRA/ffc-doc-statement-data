const comment = "Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"
const commentDate = "Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"

const sharedDatabaseFields = (DataTypes) => {
  return {
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate},
    sbi: { type: DataTypes.INTEGER, comment},
    frn: { type: DataTypes.STRING, comment},
    businessName: { type: DataTypes.STRING, comment},
    businessAddress1: { type: DataTypes.STRING, comment},
    businessAddress2: { type: DataTypes.STRING, comment},
    businessAddress3: { type: DataTypes.STRING, comment},
    businessCity: { type: DataTypes.STRING, comment},
    businessCounty: { type: DataTypes.STRING, comment},
    businessPostCode: { type: DataTypes.STRING, comment},
    businessMobile: { type: DataTypes.STRING, comment},
    businessEmailAddr: { type: DataTypes.STRING, comment}
  }
}

module.exports = sharedDatabaseFields
