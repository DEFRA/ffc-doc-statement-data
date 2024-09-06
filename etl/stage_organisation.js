const { Etl, Loaders, Validators, Transformers, Destinations } = require("ffc-pay-etl-framework")

module.exports = async function stage_organisation() {

  let csvFile = `${process.cwd()}/etl/dwh_extracts/Organization/export.csv`

  const etl = new Etl.Etl()
  const columns = [
    "ORGANISATION_WID",
    "PARTY_WID_FK",
    "REF_BUSINESS_TYPE_WID_FK",
    "REF_LEGAL_STATUS_TYPE_WID_FK",
    "PARTY_ID",
    "ORGANISATION_NAME",
    "CONFIRMED_FLG",
    "LAND_CONFIRMED_FLG",
    "SBI",
    "TAX_REGISTRATION_NUMBER",
    "LEGAL_STATUS_TYPE_ID",
    "BUSINESS_REFERENCE",
    "BUSINESS_TYPE_ID",
    "VENDOR_NUMBER",
    "W_INSERT_DT",
    "W_UPDATE_DT",
    "ETL_PROC_WID",
    "INTEGRATION_ID",
    "LAND_DETAILS_CONFIRMED_DT_KEY",
    "BUSINESS_DET_CONFIRMED_DT_KEY",
    "REGISTRATION_DATE",
    "CHARITY_COMMISSION_REGNUM",
    "COMPANIES_HOUSE_REGNUM",
    "ADDITIONAL_BUSINESSES",
    "AMENDED",
    "TRADER_NUMBER",
    "DATE_STARTED_FARMING",
    "ACCOUNTABLE_PEOPLE_COMPLETED",
    "FINANCIAL_TO_BUSINESS_ADDR",
    "CORR_AS_BUSINESS_ADDR",
    "LAST_UPDATED_ON"
  ]
  return new Promise((res, rej) => {
    try {
      etl
        .loader(new Loaders.CSVLoader({ path: csvFile, columns: columns }))
        .transform(new Transformers.FakerTransformer({
          columns: [{
            name: "ORGANISATION_NAME",
            faker: "company.name"
          }]
        }))
        .destination(new Destinations.PostgresDestination({
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          table: "etl_stage_organisation",
          host: "host.docker.internal",
          port: 5482,
          database: "ffc_doc_statement_data",
          mapping: [
            {
              column: "ORGANISATION_WID",
              targetColumn: "organisation_wid",
              targetType: "number"
            },
            {
              column: "PARTY_WID_FK",
              targetColumn: "party_wid_fk",
              targetType: "number"
            },
            {
              column: "REF_BUSINESS_TYPE_WID_FK",
              targetColumn: "ref_business_type_wid_fk",
              targetType: "number"
            },
            {
              column: "REF_LEGAL_STATUS_TYPE_WID_FK",
              targetColumn: "ref_legal_status_type_wid_fk",
              targetType: "number"
            },
            {
              column: "PARTY_ID",
              targetColumn: "party_id",
              targetType: "number"
            },
            {
              column: "ORGANISATION_NAME",
              targetColumn: "organisation_name",
              targetType: "varchar"
            },
            {
              column: "CONFIRMED_FLG",
              targetColumn: "confirmed_flg",
              targetType: "varchar"
            },
            {
              column: "LAND_CONFIRMED_FLG",
              targetColumn: "land_confirmed_flg",
              targetType: "number"
            },
            {
              column: "SBI",
              targetColumn: "sbi",
              targetType: "number"
            },
            {
              column: "TAX_REGISTRATION_NUMBER",
              targetColumn: "tax_registration_number",
              targetType: "varchar"
            },
            {
              column: "LEGAL_STATUS_TYPE_ID",
              targetColumn: "legal_status_type_id",
              targetType: "number"
            },
            {
              column: "BUSINESS_REFERENCE",
              targetColumn: "business_reference",
              targetType: "varchar"
            },
            {
              column: "BUSINESS_TYPE_ID",
              targetColumn: "business_type_id",
              targetType: "number"
            },
            {
              column: "VENDOR_NUMBER",
              targetColumn: "vendor_number",
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
              column: "LAND_DETAILS_CONFIRMED_DT_KEY",
              targetColumn: "land_details_confirmed_dt_key",
              targetType: "number"
            },
            {
              column: "BUSINESS_DET_CONFIRMED_DT_KEY",
              targetColumn: "business_det_confirmed_dt_key",
              targetType: "number"
            },
            {
              column: "REGISTRATION_DATE",
              targetColumn: "registration_date",
              targetType: "varchar"
            },
            {
              column: "CHARITY_COMMISSION_REGNUM",
              targetColumn: "charity_commission_regnum",
              targetType: "varchar"
            },
            {
              column: "COMPANIES_HOUSE_REGNUM",
              targetColumn: "companies_house_regnum",
              targetType: "varchar"
            },
            {
              column: "ADDITIONAL_BUSINESSES",
              targetColumn: "additional_businesses",
              targetType: "number"
            },
            {
              column: "AMENDED",
              targetColumn: "amended",
              targetType: "number"
            },
            {
              column: "TRADER_NUMBER",
              targetColumn: "trader_number",
              targetType: "varchar"
            },
            {
              column: "DATE_STARTED_FARMING",
              targetColumn: "date_started_farming",
              targetType: "varchar"
            },
            {
              column: "ACCOUNTABLE_PEOPLE_COMPLETED",
              targetColumn: "accountable_people_completed",
              targetType: "number"
            },
            {
              column: "FINANCIAL_TO_BUSINESS_ADDR",
              targetColumn: "financial_to_business_addr",
              targetType: "number"
            },
            {
              column: "CORR_AS_BUSINESS_ADDR",
              targetColumn: "corr_as_business_addr",
              targetType: "number"
            },
            {
              column: "LAST_UPDATED_ON",
              targetColumn: "last_updated_on",
              targetType: "varchar"
            }
          ],
          includeErrors: false
        }))
        .pump()
        .on('finish', (data) => res(data))
        .on('result', (data) => {
          global.results.push({
            table: "etl_stage_organisation",
            database: "ffc_doc_statement_data",
            data: data
          })
        })
    } catch (e) {
      rej(e)
    }
  })
}