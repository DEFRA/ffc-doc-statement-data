const { Etl, Loaders, Validators, Transformers, Destinations, Connections } = require("ffc-pay-etl-framework")

module.exports = async function stage_css_options() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/CSS_Options/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "CHANGE_TYPE",
    "CHANGE_TIME",
    "OPTION_TYPE_ID",
    "OPTION_DESCRIPTION",
    "OPTION_LONG_DESCRIPTION",
    "DURATION",
    "OPTION_CODE",
    "CONTRACT_TYPE_ID",
    "START_DT",
    "END_DT",
    "GROUP_ID"
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
          table: "etl_stage_css_options",
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
              column: "OPTION_TYPE_ID",
              targetColumn: "option_type_id",
              targetType: "number"
            },
            {
              column: "OPTION_DESCRIPTION",
              targetColumn: "option_description",
              targetType: "varchar"
            },
            {
              column: "OPTION_LONG_DESCRIPTION",
              targetColumn: "option_long_description",
              targetType: "varchar"
            },
            {
              column: "DURATION",
              targetColumn: "duration",
              targetType: "number"
            },
            {
              column: "OPTION_CODE",
              targetColumn: "option_code",
              targetType: "varchar"
            },
            {
              column: "CONTRACT_TYPE_ID",
              targetColumn: "contract_type_id",
              targetType: "number"
            },
            {
              column: "START_DT",
              targetColumn: "start_dt",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "END_DT",
              targetColumn: "end_dt",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "GROUP_ID",
              targetColumn: "group_id",
              targetType: "varchar"
            }
          ],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_css_options",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })
}