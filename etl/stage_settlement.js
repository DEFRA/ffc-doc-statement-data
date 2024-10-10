const { Etl, Loaders, Validators, Transformers, Destinations, Connections } = require("ffc-pay-etl-framework")

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
          table: "etl_stage_settlement",
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