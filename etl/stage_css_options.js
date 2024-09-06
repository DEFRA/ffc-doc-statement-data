const { Etl, Loaders, Validators, Transformers, Destinations } = require("ffc-pay-etl-framework")

module.exports = async function stage_css_options() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/CSS_Options/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "CSS_OPTION_WID",
    "OPTION_TYPE_ID",
    "OPTION_DESCRIPTION",
    "OPTION_LONG_DESCRIPTION",
    "DURATION",
    "OPTION_CODE",
    "CONTRACT_TYPE_ID",
    "START_DT",
    "END_DT",
    "GROUP_ID",
    "W_INSERT_DT",
    "W_UPDATE_DT",
    "ETL_PROC_WID",
    "INTEGRATION_ID"
  ]
  return new Promise((res, rej) => {
    try {
      etl
        .loader(new Loaders.CSVLoader({ path: csvFile, columns: columns }))
        .destination(new Destinations.PostgresDestination({
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          table: "etl_stage_css_options",
          host: "host.docker.internal",
          port: 5482,
          database: "ffc_doc_statement_data",

          mapping: [
            {
              column: "CSS_OPTION_WID",
              targetColumn: "css_option_wid",
              targetType: "number"
            },
            {
              column: "OPTION_TYPE_ID",
              targetColumn: "option_type_id",
              targetType: "number"
            },
            {
              column: "OPTION_DESCRIPTION",
              targetColumn: "option_description",
              targetType: "string"
            },
            {
              column: "OPTION_LONG_DESCRIPTION",
              targetColumn: "option_long_description",
              targetType: "string"
            },
            {
              column: "DURATION",
              targetColumn: "duration",
              targetType: "number"
            },
            {
              column: "OPTION_CODE",
              targetColumn: "option_code",
              targetType: "string"
            },
            {
              column: "CONTRACT_TYPE_ID",
              targetColumn: "contact_type_id",
              targetType: "number"
            },
            {
              column: "START_DT",
              targetColumn: "start_dt",
              targetType: "string"
            },
            {
              column: "END_DT",
              targetColumn: "end_dt",
              targetType: "string"
            },
            {
              column: "GROUP_ID",
              targetColumn: "group_id",
              targetType: "string"
            },
            {
              column: "W_INSERT_DT",
              targetColumn: "w_insert_dt",
              targetType: "string"
            },
            {
              column: "W_UPDATE_DT",
              targetColumn: "w_update_dt",
              targetType: "string"
            },
            {
              column: "ETL_PROC_WID",
              targetColumn: "etl_proc_wid",
              targetType: "number"
            },
            {
              column: "INTEGRATION_ID",
              targetColumn: "integration_id",
              targetType: "string"
            }],
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