const { Etl, Loaders, Validators, Transformers, Destinations } = require("ffc-pay-etl-framework")

module.exports = function stage_apps_payment_notifications() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/Apps_Payment_Notification/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "APPS_PAYMENT_NOTIFICATION_WID",
    "APPLICATION_ID",
    "ID_CLC_HEADER",
    "NOTIFICATION_DT",
    "NOTIFICATION_FLAG",
    "NOTIFIER_KEY",
    "NOTIFICATION_TEXT",
    "W_INSERT_DT",
    "W_UPDATE_DT",
    "ETL_PROC_WID",
    "INTEGRATION_ID",
    "INVOICE_NUMBER",
    "REQUEST_INVOICE_NUMBER",
    "PILLAR",
    "DELIVERY_BODY_CODE",
    "PAYMENT_PREFERENCE_CURRENCY"
  ]
  return new Promise((res, rej) => {
    try {
      etl
        .loader(new Loaders.CSVLoader({ path: csvFile, columns: columns }))
        .destination(new Destinations.PostgresDestination({
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          table: "etl_stage_apps_payment_notification",
          host: "host.docker.internal",
          port: 5482,
          database: "ffc_doc_statement_data",
          mapping: [
            {
              column: "APPS_PAYMENT_NOTIFICATION_WID",
              targetColumn: "apps_payment_notification_wid",
              targetType: "number"
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
              column: "NOTIFICATION_DT",
              targetColumn: "notification_dt",
              targetType: "varchar"
            },
            {
              column: "NOTIFICATION_FLAG",
              targetColumn: "notification_flag",
              targetType: "varchar"
            },
            {
              column: "NOTIFIER_KEY",
              targetColumn: "notifier_key",
              targetType: "number"
            },
            {
              column: "NOTIFICATION_TEXT",
              targetColumn: "notification_text",
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
            },
            {
              column: "INVOICE_NUMBER",
              targetColumn: "INVOICE_NUMBER",
              targetType: "varchar"
            },
            {
              column: "REQUEST_INVOICE_NUMBER",
              targetColumn: "request_invoice_number",
              targetType: "varchar"
            },
            {
              column: "PILLAR",
              targetColumn: "pillar",
              targetType: "varchar"
            },
            {
              column: "DELIVERY_BODY_CODE",
              targetColumn: "delivery_body_code",
              targetType: "varchar"
            },
            {
              column: "PAYMENT_PREFERENCE_CURRENCY",
              targetColumn: "payment_preference_currency",
              targetType: "varchar"
            }
          ],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_apps_payment_notification",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })
}