const { Etl, Loaders, Validators, Transformers, Destinations, Connections } = require("ffc-pay-etl-framework")

module.exports = async function stage_tclc_pii_pay_claim_sfimt_option() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/capd_dwh_ods.tclc_pii_pay_claim_sfimt_option/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "CHANGE_TYPE",
    "CHANGE_TIME",
    "APPLICATION_ID",
    "CALCULATION_ID",
    "OP_CODE",
    "SCO_UOM",
    "COMMITMENT",
    "COMMITMENT_VAL",
    "AGREE_AMOUNT",
    "CLAIMED_PAY_AMOUNT",
    "VERIF_PAY_AMOUNT",
    "FOUND_AMOUNT",
    "OVERD_REDUCT_AMOUNT",
    "OVERD_PENALTY_AMOUNT",
    "NET1_AMOUNT"
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
          table: "etl_stage_tclc_pii_pay_claim_sfimt_option",
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
              column: "CALCULATION_ID",
              targetColumn: "calculation_id",
              targetType: "number"
            },
            {
              column: "OP_CODE",
              targetColumn: "op_code",
              targetType: "varchar"
            },
            {
              column: "SCO_UOM",
              targetColumn: "sco_uom",
              targetType: "varchar"
            },
            {
              column: "COMMITMENT",
              targetColumn: "commitment",
              targetType: "number"
            },
            {
              column: "COMMITMENT_VAL",
              targetColumn: "commitment_val",
              targetType: "number"
            },
            {
              column: "AGREE_AMOUNT",
              targetColumn: "agree_amount",
              targetType: "number"
            },
            {
              column: "CLAIMED_PAY_AMOUNT",
              targetColumn: "claimed_pay_amount",
              targetType: "number"
            },
            {
              column: "VERIF_PAY_AMOUNT",
              targetColumn: "verify_pay_amount",
              targetType: "number"
            },
            {
              column: "FOUND_AMOUNT",
              targetColumn: "found_amount",
              targetType: "number"
            },
            {
              column: "OVERD_REDUCT_AMOUNT",
              targetColumn: "overd_reduct_amount",
              targetType: "number"
            },
            {
              column: "OVERD_PENALTY_AMOUNT",
              targetColumn: "overd_penalty_amount",
              targetType: "number"
            },
            {
              column: "NET1_AMOUNT",
              targetColumn: "net1_amount",
              targetType: "number"
            }
          ],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_tclc_pii_pay_claim_sfimt_option",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })
}