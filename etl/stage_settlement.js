const { Etl, Loaders, Validators, Transformers, Destinations } = require("ffc-pay-etl-framework")

module.exports = async function stage_organisation() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/Settlements/export.csv`

  const etl = new Etl.Etl()
  const columns = [
    "settlementId",
    "paymentRequestId",
    "detail",
    "invalid",
    "generated",
    "invoiceNumber",
    "ledger",
    "reference",
    "settled",
    "settlementDate",
    "value",
    "sourceSystem",
    "frn",
    "received"
  ]

  return new Promise((res, rej) => {
    try {
      etl
        .loader(new Loaders.CSVLoader({ path: csvFile, columns: columns }))
        .destination(new Destinations.PostgresDestination({
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          table: "etl_stage_settlement",
          host: "host.docker.internal",
          port: 5482,
          database: "ffc_doc_statement_data",
          mapping: [
            {
              column: "settlementId",
              targetColumn: "SETTLEMENT_ID",
              targetType: "number"
            },
            {
              column: "paymentRequestId",
              targetColumn: "PAYMENT_REQUEST_ID",
              targetType: "number"
            },
            {
              column: "detail",
              targetColumn: "DETAIL",
              targetType: "varchar"
            },
            {
              column: "invalid",
              targetColumn: "INVALID",
              targetType: "boolean"
            },
            {
              column: "generated",
              targetColumn: "GENERATED",
              targetType: "boolean"
            },
            {
              column: "invoiceNumber",
              targetColumn: "INVOICE_NUMBER",
              targetType: "varchar"
            },
            {
              column: "ledger",
              targetColumn: "LEDGER",
              targetType: "varchar"
            },
            {
              column: "reference",
              targetColumn: "REFERENCE",
              targetType: "varchar"
            },
            {
              column: "settled",
              targetColumn: "SETTLED",
              targetType: "boolean"
            },
            {
              column: "settlementDate",
              targetColumn: "SETTLEMENT_DATE",
              targetType: "varchar"
            },
            {
              column: "value",
              targetColumn: "VALUE",
              targetType: "number"
            },
            {
              column: "sourceSystem",
              targetColumn: "SOURCE_SYSTEM",
              targetType: "varchar"
            },
            {
              column: "frn",
              targetColumn: "FRN",
              targetType: "number"
            },
            {
              column: "received",
              targetColumn: "RECEIVED",
              targetType: "varchar"
            }
          ],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_settlement",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })
}