const { Etl, Loaders, Validators, Transformers, Destinations } = require("ffc-pay-etl-framework")

module.exports = async function stage_defra_links() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/Defra_Links/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "DEFRA_LINKS_WID",
    "SUBJECT_ID",
    "DEFRA_ID",
    "DEFRA_TYPE",
    "MDM_ID",
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
          table: "etl_stage_defra_links",
          host: "host.docker.internal",
          port: 5482,
          database: "ffc_doc_statement_data",
          mapping: [
            {
              column: "DEFRA_LINKS_WID",
              targetColumn: "defra_links_wid",
              targetType: "number"
            },
            {
              column: "SUBJECT_ID",
              targetColumn: "subject_id",
              targetType: "number"
            },
            {
              column: "DEFRA_ID",
              targetColumn: "defra_id",
              targetType: "varchar"
            },
            {
              column: "DEFRA_TYPE",
              targetColumn: "defra_type",
              targetType: "varchar"
            },
            {
              column: "MDM_ID",
              targetColumn: "mdm_id",
              targetType: "number"
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
            }],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_defra_links",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })
}