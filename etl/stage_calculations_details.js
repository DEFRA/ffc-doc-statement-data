const { Etl, Loaders, Destinations, Connections } = require("ffc-pay-etl-framework")

module.exports = async function stage_calculation_details() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/Calculations_Details_MV/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "CHANGE_TYPE",
    "CHANGE_TIME",
    "APPLICATION_ID",
    "ID_CLC_HEADER",
    "CALCULATION_ID",
    "CALCULATION_DT",
    "RANKED"
  ]
  return new Promise(async (res, rej) => {
    try {
      etl
        .connection(await new Connections.PostgresDatabaseConnection({
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          host: "host.docker.internal",
          database: "ffc_doc_statement_data",
          port: 5482,
          name: "postgresConnection"
        }))
        .loader(new Loaders.CSVLoader({ path: csvFile, columns: columns }))
        .destination(new Destinations.PostgresDestination({
          connection: "postgresConnection",
          table: "etl_stage_calculation_details",
          mapping: [
            {
              column: "CHANGE_TYPE",
              targetColumn: "change_type",
              targetType: "varchar"
            },
            {
              column: "CHANGE_TIME",
              targetColumn: "change_time",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "APPLICATION_ID",
              targetColumn: "application_id",
              targetType: "number"
            },
            {
              column: "ID_CLC_HEADER",
              targetColumn: "id_clc_header",
              targetType: "number"
            },
            {
              column: "CALCULATION_ID",
              targetColumn: "calculation_id",
              targetType: "number"
            },
            {
              column: "CALCULATION_DT",
              targetColumn: "calculation_dt",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "RANKED",
              targetColumn: "ranked",
              targetType: "number"
            }
          ],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_calculation_details",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })
}