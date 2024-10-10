const { Etl, Loaders, Validators, Transformers, Destinations, Connections } = require("ffc-pay-etl-framework")

module.exports = function stage_apps_payment_notifications() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/Apps_Payment_Notification/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "CHANGE_TYPE",
    "CHANGE_TIME",
    "APPLICATION_ID",
    "ID_CLC_HEADER",
    "NOTIFICATION_DT",
    "NOTIFICATION_FLAG",
    "NOTIFIER_KEY",
    "NOTIFICATION_TEXT",
    "INVOICE_NUMBER",
    "REQUEST_INVOICE_NUMBER",
    "PILLAR",
    "DELIVERY_BODY_CODE",
    "PAYMENT_PREFERENCE_CURRENCY"
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
          table: "etl_stage_apps_payment_notification",
          connection: "postgresConnection",
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
              column: "NOTIFICATION_DT",
              targetColumn: "notification_dt",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
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