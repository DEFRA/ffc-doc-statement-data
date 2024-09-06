const { Etl, Loaders, Validators, Transformers, Destinations } = require("ffc-pay-etl-framework")

module.exports = async function stage_tclc_pii_pay_claim_sfimt_option() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/capd_dwh_ods.tclc_pii_pay_claim_sfimt_option/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "TCLC_PII_PAY_CLAIM_SFIMT_OPTION_WID",
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
    "NET1_AMOUNT",
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
          table: "etl_stage_tclc_pii_pay_claim_sfimt_option",
          host: "host.docker.internal",
          port: 5482,
          database: "ffc_doc_statement_data",
          mapping: [
            {
              column: "TCLC_PII_PAY_CLAIM_SFIMT_OPTION_WID",
              targetColumn: "tclc_pii_pay_claim_sfimt_option_wid",
              targetType: "number"
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