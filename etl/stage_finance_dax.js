const { Etl, Loaders, Validators, Transformers, Destinations } = require("ffc-pay-etl-framework")

module.exports = async function stage_finance_dax() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/Finance_Dax/export.csv`

  const etl = new Etl.Etl()

  const columns = [
    "CHANGE_TYPE",
    "CHANGE_TIME",
    "TRANSDATE",
    "ACCOUNTTYPE",
    "INVOICEID",
    "INVOICEDATE",
    "SCHEME",
    "FUND",
    "MARKETINGYEAR",
    "ACCOUNTNUM",
    "DELIVERYBODY",
    "ACCRUALSTATUS",
    "SETTLEMENTVOUCHER",
    "LINEAMOUNTEUR",
    "LINEAMOUNTMSTGBP",
    "TRANSACTIONTYPE",
    "JOURNALNUM",
    "JOURNALNAME",
    "ADMINDEBT",
    "VOUCHER",
    "MONTH",
    "AMOUNTEUR",
    "AMOUNTMSTGBP",
    "QUARTER",
    "IDVOUCHER",
    "TRANSTXT",
    "IRREGULARITYDEBT",
    "SECTIONTYPE",
    "TRANSRECID",
    "LJTRANSRECID",
    "GLACCOUNTENTRYRECID",
    "SETTLEMENTRECID",
    "RUNNUMBER",
    "REPORTINGTYPE",
    "CUSTVENDAC",
    "MODIFIEDDATETIME",
    "MODIFIEDBY",
    "CREATEDDATETIME",
    "CREATEDBY",
    "DATAAREAID",
    "PARTITION_FLD",
    "RECID",
    "EURUNNUMBER",
    "ACCRUALLEDGERDIMENSIONACCOUNT",
    "ACCRUALGJACCOUNTENTRYRECID",
    "CURRENCYCODE",
    "LEGACYFARMERACCOUNT",
    "CLAIMSETTLEMENTDATE",
    "CLAIMREFNUM",
    "ISEURELEVANT",
    "FUNDEDBY",
    "EUYEARSTARTDATE",
    "EUYEARENDDATE",
    "YEARENDRUNNUMBER",
    "REASON",
    "EXCHRATECALCTYPE",
    "POSTINGDATE",
    "DATAWAREHOUSERUNNUM",
    "CROSSCOMPLIANCE",
    "PENALTY",
    "EXCHFUNDEDEUR",
    "EXCHFUNDEDGBP",
    "FESTXNNUM",
    "FESTXNLINENUM",
    "ADVPAYFLAG",
    "DAXINVOICENUM",
    "DWHTXNTYPE",
    "RETENTION",
    "DUMMYT104",
    "F106GBP",
    "SCHEMEEXCHANGERATE",
    "AGREEMENTREFERENCE",
    "OEDATE",
    "SETTLEMENTVOUCHER1",
    "ANNEXIITRANSTYPE",
    "BPALLOCATIONTYPE",
    "SCHEMETYPE",
    "APPLICATIONREFERENCE"
  ]
  return new Promise((res, rej) => {
    try {
      etl
        .loader(new Loaders.CSVLoader({ path: csvFile, columns: columns }))
        .destination(new Destinations.PostgresDestination({
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          table: "etl_stage_finance_dax",
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
              column: "TRANSDATE",
              targetColumn: "transdate",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "ACCOUNTTYPE",
              targetColumn: "accounttype",
              targetType: "number"
            },
            {
              column: "INVOICEID",
              targetColumn: "invoiceid",
              targetType: "varchar"
            },
            {
              column: "INVOICEDATE",
              targetColumn: "invoicedate",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "SCHEME",
              targetColumn: "scheme",
              targetType: "varchar"
            },
            {
              column: "FUND",
              targetColumn: "fund",
              targetType: "varchar"
            },
            {
              column: "MARKETINGYEAR",
              targetColumn: "marketingyear",
              targetType: "varchar"
            },
            {
              column: "ACCOUNTNUM",
              targetColumn: "accountnum",
              targetType: "varchar"
            },
            {
              column: "DELIVERYBODY",
              targetColumn: "deliverybody",
              targetType: "varchar"
            },
            {
              column: "ACCRUALSTATUS",
              targetColumn: "accrualstatus",
              targetType: "number"
            },
            {
              column: "SETTLEMENTVOUCHER",
              targetColumn: "settlementvoucher",
              targetType: "varchar"
            },
            {
              column: "LINEAMOUNTEUR",
              targetColumn: "lineamounteur",
              targetType: "number"
            },
            {
              column: "LINEAMOUNTMSTGBP",
              targetColumn: "lineamountmstgbp",
              targetType: "number"
            },
            {
              column: "TRANSACTIONTYPE",
              targetColumn: "transactiontype",
              targetType: "number"
            },
            {
              column: "JOURNALNUM",
              targetColumn: "journalnum",
              targetType: "varchar"
            },
            {
              column: "JOURNALNAME",
              targetColumn: "journalname",
              targetType: "varchar"
            },
            {
              column: "ADMINDEBT",
              targetColumn: "admindebt",
              targetType: "number"
            },
            {
              column: "VOUCHER",
              targetColumn: "voucher",
              targetType: "varchar"
            },
            {
              column: "MONTH",
              targetColumn: "month",
              targetType: "varchar"
            },
            {
              column: "AMOUNTEUR",
              targetColumn: "amounteur",
              targetType: "number"
            },
            {
              column: "AMOUNTMSTGBP",
              targetColumn: "amountmstgbp",
              targetType: "number"
            },
            {
              column: "QUARTER",
              targetColumn: "quarter",
              targetType: "varchar"
            },
            {
              column: "IDVOUCHER",
              targetColumn: "idvoucher",
              targetType: "varchar"
            },
            {
              column: "TRANSTXT",
              targetColumn: "transtxt",
              targetType: "varchar"
            },
            {
              column: "IRREGULARITYDEBT",
              targetColumn: "irregularitydebt",
              targetType: "number"
            },
            {
              column: "SECTIONTYPE",
              targetColumn: "sectiontype",
              targetType: "number"
            },
            {
              column: "TRANSRECID",
              targetColumn: "transrecid",
              targetType: "number"
            },
            {
              column: "LJTRANSRECID",
              targetColumn: "ljtransrecid",
              targetType: "number"
            },
            {
              column: "GLACCOUNTENTRYRECID",
              targetColumn: "glaccountentryrecid",
              targetType: "number"
            },
            {
              column: "SETTLEMENTRECID",
              targetColumn: "settlementrecid",
              targetType: "number"
            },
            {
              column: "RUNNUMBER",
              targetColumn: "runnumber",
              targetType: "varchar"
            },
            {
              column: "REPORTINGTYPE",
              targetColumn: "reportingtype",
              targetType: "number"
            },
            {
              column: "CUSTVENDAC",
              targetColumn: "custvendac",
              targetType: "varchar"
            },
            {
              column: "MODIFIEDDATETIME",
              targetColumn: "modifieddatetime",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "MODIFIEDBY",
              targetColumn: "modifiedby",
              targetType: "varchar"
            },
            {
              column: "CREATEDDATETIME",
              targetColumn: "createddatetime",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "CREATEDBY",
              targetColumn: "createdby",
              targetType: "varchar"
            },
            {
              column: "DATAAREAID",
              targetColumn: "dataareaid",
              targetType: "varchar"
            },
            {
              column: "PARTITION_FLD",
              targetColumn: "partition",
              targetType: "varchar"
            },
            {
              column: "RECID",
              targetColumn: "recid",
              targetType: "number"
            },
            {
              column: "EURUNNUMBER",
              targetColumn: "eurunnumber",
              targetType: "varchar"
            },
            {
              column: "ACCRUALLEDGERDIMENSIONACCOUNT",
              targetColumn: "accrualledgerdimensionaccount",
              targetType: "number"
            },
            {
              column: "ACCRUALGJACCOUNTENTRYRECID",
              targetColumn: "accrualgjaccountentryrecid",
              targetType: "number"
            },
            {
              column: "CURRENCYCODE",
              targetColumn: "currencycode",
              targetType: "varchar"
            },
            {
              column: "LEGACYFARMERACCOUNT",
              targetColumn: "legacyfarmeraccount",
              targetType: "varchar"
            },
            {
              column: "CLAIMSETTLEMENTDATE",
              targetColumn: "claimsettlementdate",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "CLAIMREFNUM",
              targetColumn: "claimrefnum",
              targetType: "varchar"
            },
            {
              column: "ISEURELEVANT",
              targetColumn: "iseurelevant",
              targetType: "number"
            },
            {
              column: "FUNDEDBY",
              targetColumn: "fundedby",
              targetType: "number"
            },
            {
              column: "EUYEARSTARTDATE",
              targetColumn: "euyearstartdate",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "EUYEARENDDATE",
              targetColumn: "euyearenddate",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "YEARENDRUNNUMBER",
              targetColumn: "yearendrunnumber",
              targetType: "varchar"
            },
            {
              column: "REASON",
              targetColumn: "reason",
              targetType: "varchar"
            },
            {
              column: "EXCHRATECALCTYPE",
              targetColumn: "exchratecalctype",
              targetType: "number"
            },
            {
              column: "POSTINGDATE",
              targetColumn: "postingdate",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "DATAWAREHOUSERUNNUM",
              targetColumn: "datawarehouserunnum",
              targetType: "varchar"
            },
            {
              column: "CROSSCOMPLIANCE",
              targetColumn: "crosscompliance",
              targetType: "number"
            },
            {
              column: "PENALTY",
              targetColumn: "penalty",
              targetType: "number"
            },
            {
              column: "EXCHFUNDEDEUR",
              targetColumn: "exchfundedeur",
              targetType: "number"
            },
            {
              column: "EXCHFUNDEDGBP",
              targetColumn: "exchfundedgbp",
              targetType: "number"
            },
            {
              column: "FESTXNNUM",
              targetColumn: "festxnnum",
              targetType: "varchar"
            },
            {
              column: "FESTXNLINENUM",
              targetColumn: "festxnlinenum",
              targetType: "number"
            },
            {
              column: "ADVPAYFLAG",
              targetColumn: "advpayflag",
              targetType: "number"
            },
            {
              column: "DAXINVOICENUM",
              targetColumn: "daxinvoicenum",
              targetType: "varchar"
            },
            {
              column: "DWHTXNTYPE",
              targetColumn: "dwhtxntype",
              targetType: "varchar"
            },
            {
              column: "RETENTION",
              targetColumn: "retention",
              targetType: "number"
            },
            {
              column: "DUMMYT104",
              targetColumn: "dummyt104",
              targetType: "number"
            },
            {
              column: "F106GBP",
              targetColumn: "f106gbp",
              targetType: "number"
            },
            {
              column: "SCHEMEEXCHANGERATE",
              targetColumn: "schemeexchangerate",
              targetType: "number"
            },
            {
              column: "AGREEMENTREFERENCE",
              targetColumn: "agreementreference",
              targetType: "varchar"
            },
            {
              column: "OEDATE",
              targetColumn: "oedate",
              targetType: "date",
              format: "DD-MM-YYYY HH24:MI:SS"
            },
            {
              column: "SETTLEMENTVOUCHER1",
              targetColumn: "settlementvoucher1",
              targetType: "varchar"
            },
            {
              column: "ANNEXIITRANSTYPE",
              targetColumn: "annexiitranstype",
              targetType: "number"
            },
            {
              column: "BPALLOCATIONTYPE",
              targetColumn: "bpallocationtype",
              targetType: "number"
            },
            {
              column: "SCHEMETYPE",
              targetColumn: "schemetype",
              targetType: "number"
            },
            {
              column: "APPLICATIONREFERENCE",
              targetColumn: "applicationreference",
              targetType: "varchar"
            }],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_finance_dax",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })
}