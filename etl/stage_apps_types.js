const { Etl, Loaders, Validators, Transformers, Destinations } = require("ffc-pay-etl-framework")

module.exports = async function stage_apps_types() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/Apps_Types/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "CHANGE_TYPE",
    "CHANGE_TIME",
    "APP_TYPE_ID",
    "SECTOR_P_CODE",
    "SECTOR_S_CODE",
    "SHORT_DESCRIPTION",
    "EXT_DESCRIPTION",
    "YEAR",
    "WIN_OPEN_DATE",
    "WIN_CLOSE_DATE"
  ]
  return new Promise((res, rej) => {
    try {
      etl
        .loader(new Loaders.CSVLoader({ path: csvFile, columns: columns }))
        .destination(new Destinations.PostgresDestination({
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          table: "etl_stage_apps_types",
          host: "host.docker.internal",
          port: 5482,
          database: "ffc_doc_statement_data",
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
              column: "APP_TYPE_ID",
              targetColumn: "app_type_id",
              targetType: "number"
            },
            {
              column: "SECTOR_P_CODE",
              targetColumn: "sector_p_code",
              targetType: "varchar"
            },
            {
              column: "SECTOR_S_CODE",
              targetColumn: "sector_s_code",
              targetType: "varchar"
            },
            {
              column: "SHORT_DESCRIPTION",
              targetColumn: "short_description",
              targetType: "varchar"
            },
            {
              column: "EXT_DESCRIPTION",
              targetColumn: "ext_description",
              targetType: "varchar"
            },
            {
              column: "YEAR",
              targetColumn: "year",
              targetType: "number"
            },
            {
              column: "WIN_OPEN_DATE",
              targetColumn: "win_open_date",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "WIN_CLOSE_DATE",
              targetColumn: "win_close_date",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            }
          ],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_apps_types",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })
}