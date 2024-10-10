const { Etl, Loaders, Validators, Transformers, Destinations, Connections } = require("ffc-pay-etl-framework")
module.exports = async function stage_application_details() {
  let csvFile = `${process.cwd()}/etl/dwh_extracts/Application_Detail/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "CHANGE_TYPE",
    "CHANGE_TIME",
    "PKID",
    "DT_INSERT",
    "DT_DELETE",
    "SUBJECT_ID",
    "UTE_ID",
    "APPLICATION_ID",
    "APPLICATION_CODE",
    "AMENDED_APP_ID",
    "APP_TYPE_ID",
    "PROXY_ID",
    "STATUS_P_CODE",
    "STATUS_S_CODE",
    "SOURCE_P_CODE",
    "SOURCE_S_CODE",
    "DT_START",
    "DT_END",
    "VALID_START_FLG",
    "VALID_END_FLG",
    "APP_ID_START",
    "APP_ID_END",
    "DT_REC_UPDATE",
    "USER_ID"
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
          table: "etl_stage_application_detail",
          connection: "postgresConnection",
          includeErrors: false,
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
              column: "PKID",
              targetColumn: "pkid",
              targetType: "number"
            },
            {
              column: "DT_INSERT",
              targetColumn: "dt_insert",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "DT_DELETE",
              targetColumn: "dt_delete",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "SUBJECT_ID",
              targetColumn: "subject_id",
              targetType: "number"
            },
            {
              column: "UTE_ID",
              targetColumn: "ute_id",
              targetType: "number"
            },
            {
              column: "APPLICATION_ID",
              targetColumn: "application_id",
              targetType: "number"
            },
            {
              column: "APPLICATION_CODE",
              targetColumn: "application_code",
              targetType: "varchar"
            },
            {
              column: "AMENDED_APP_ID",
              targetColumn: "amended_app_id",
              targetType: "number"
            },
            {
              column: "APP_TYPE_ID",
              targetColumn: "app_type_id",
              targetType: "number"
            },
            {
              column: "PROXY_ID",
              targetColumn: "proxy_id",
              targetType: "number"
            },
            {
              column: "STATUS_P_CODE",
              targetColumn: "status_p_code",
              targetType: "varchar"
            },
            {
              column: "STATUS_S_CODE",
              targetColumn: "status_s_code",
              targetType: "varchar"
            },
            {
              column: "SOURCE_P_CODE",
              targetColumn: "source_p_code",
              targetType: "varchar"
            },
            {
              column: "SOURCE_S_CODE",
              targetColumn: "source_s_code",
              targetType: "varchar"
            },
            {
              column: "DT_START",
              targetColumn: "dt_start",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "DT_END",
              targetColumn: "dt_end",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "VALID_START_FLG",
              targetColumn: "valid_start_flg",
              targetType: "varchar"
            },
            {
              column: "VALID_END_FLG",
              targetColumn: "valid_end_flg",
              targetType: "varchar"
            },
            {
              column: "APP_ID_START",
              targetColumn: "app_id_start",
              targetType: "number"
            },
            {
              column: "APP_ID_END",
              targetColumn: "app_id_end",
              targetType: "number"
            },
            {
              column: "DT_REC_UPDATE",
              targetColumn: "dt_rec_update",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "USER_ID",
              targetColumn: "user_id",
              targetType: "varchar"
            }
          ],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_application_detail",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })

}

