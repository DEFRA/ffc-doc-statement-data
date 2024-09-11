const { Etl, Loaders, Validators, Transformers, Destinations } = require("ffc-pay-etl-framework")

module.exports = async function stage_css_contract_applications() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/CSS_Contract_Applications/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "CSS_CONTRACT_APPLICATION_WID",
    "PKID",
    "INSERT_DT",
    "DELETE_DT",
    "CONTRACT_ID",
    "APPLICATION_ID",
    "TYPE_P_CODE",
    "TYPE_S_CODE",
    "DATA_SOURCE_P_CODE",
    "DATA_SOURCE_S_CODE",
    "START_DT",
    "END_DT",
    "VALID_START_FLAG",
    "VALID_END_FLAG",
    "START_ACT_ID",
    "END_ACT_ID",
    "LAST_UPDATE_DT",
    "USER",
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
          table: "etl_stage_css_contract_applications",
          host: "host.docker.internal",
          port: 5482,
          database: "ffc_doc_statement_data",
          mapping: [
            {
              column: "CSS_CONTRACT_APPLICATION_WID",
              targetColumn: "css_contract_application_wid",
              targetType: "number"
            },
            {
              column: "PKID",
              targetColumn: "pkid",
              targetType: "number"
            },
            {
              column: "INSERT_DT",
              targetColumn: "insert_dt",
              targetType: "varchar"
            },
            {
              column: "DELETE_DT",
              targetColumn: "delete_dt",
              targetType: "varchar"
            },
            {
              column: "CONTRACT_ID",
              targetColumn: "contract_id",
              targetType: "number"
            },
            {
              column: "APPLICATION_ID",
              targetColumn: "application_id",
              targetType: "number"
            },
            {
              column: "TYPE_P_CODE",
              targetColumn: "type_p_code",
              targetType: "varchar"
            },
            {
              column: "TYPE_S_CODE",
              targetColumn: "type_s_code",
              targetType: "varchar"
            },
            {
              column: "DATA_SOURCE_P_CODE",
              targetColumn: "data_source_p_code",
              targetType: "varchar"
            },
            {
              column: "DATA_SOURCE_S_CODE",
              targetColumn: "data_source_s_code",
              targetType: "varchar"
            },
            {
              column: "START_DT",
              targetColumn: "start_dt",
              targetType: "varchar"
            },
            {
              column: "END_DT",
              targetColumn: "end_dt",
              targetType: "varchar"
            },
            {
              column: "VALID_START_FLAG",
              targetColumn: "valid_start_flag",
              targetType: "varchar"
            },
            {
              column: "VALID_END_FLAG",
              targetColumn: "valid_end_flag",
              targetType: "varchar"
            },
            {
              column: "START_ACT_ID",
              targetColumn: "start_act_id",
              targetType: "number"
            },
            {
              column: "END_ACT_ID",
              targetColumn: "end_act_id",
              targetType: "number"
            },
            {
              column: "LAST_UPDATE_DT",
              targetColumn: "last_update_dt",
              targetType: "varchar"
            },
            {
              column: "USER",
              targetColumn: "USER",
              targetType: "varchar"
            },
            {
              column: "W_INSERT_DT",
              targetColumn: "w_insert_dt",
              targetType: "varchar"
            },
            {
              column: "W_UPDATE_DT",
              targetColumn: "w_update_dt",
              targetType: "varchar"
            },
            {
              column: "ETL_PROC_WID",
              targetColumn: "etl_proc_wid",
              targetType: "number"
            },
            {
              column: "INTEGRATION_ID",
              targetColumn: "integration_id",
              targetType: "varchar"
            }
          ],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_css_contract_applications",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })
}