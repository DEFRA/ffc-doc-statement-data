const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { financeDAX } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageFinanceDAX = async (monthDayFormat = false, folder = 'financeDAX') => {
  const format = monthDayFormat ? monthDayYearDateTimeFormat : dateTimeFormat
  const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')

  const columns = [
    sourceColumnNames.CHANGE_TYPE,
    sourceColumnNames.CHANGE_TIME,
    sourceColumnNames.TRANSDATE,
    sourceColumnNames.ACCOUNTTYPE,
    sourceColumnNames.INVOICEID,
    sourceColumnNames.INVOICEDATE,
    sourceColumnNames.SCHEME,
    sourceColumnNames.FUND,
    sourceColumnNames.MARKETINGYEAR,
    sourceColumnNames.ACCOUNTNUM,
    sourceColumnNames.DELIVERYBODY,
    sourceColumnNames.ACCRUALSTATUS,
    sourceColumnNames.SETTLEMENTVOUCHER,
    sourceColumnNames.LINEAMOUNTEUR,
    sourceColumnNames.LINEAMOUNTMSTGBP,
    sourceColumnNames.TRANSACTIONTYPE,
    sourceColumnNames.JOURNALNUM,
    sourceColumnNames.JOURNALNAME,
    sourceColumnNames.ADMINDEBT,
    sourceColumnNames.VOUCHER,
    sourceColumnNames.MONTH,
    sourceColumnNames.AMOUNTEUR,
    sourceColumnNames.AMOUNTMSTGBP,
    sourceColumnNames.QUARTER,
    sourceColumnNames.IDVOUCHER,
    sourceColumnNames.TRANSTXT,
    sourceColumnNames.IRREGULARITYDEBT,
    sourceColumnNames.SECTIONTYPE,
    sourceColumnNames.TRANSRECID,
    sourceColumnNames.LJTRANSRECID,
    sourceColumnNames.GLACCOUNTENTRYRECID,
    sourceColumnNames.SETTLEMENTRECID,
    sourceColumnNames.RUNNUMBER,
    sourceColumnNames.REPORTINGTYPE,
    sourceColumnNames.CUSTVENDAC,
    sourceColumnNames.MODIFIEDDATETIME,
    sourceColumnNames.MODIFIEDBY,
    sourceColumnNames.CREATEDDATETIME,
    sourceColumnNames.CREATEDBY,
    sourceColumnNames.DATAAREAID,
    sourceColumnNames.PARTITION_FLD,
    sourceColumnNames.RECID,
    sourceColumnNames.EURUNNUMBER,
    sourceColumnNames.ACCRUALLEDGERDIMENSIONACCOUNT,
    sourceColumnNames.ACCRUALGJACCOUNTENTRYRECID,
    sourceColumnNames.CURRENCYCODE,
    sourceColumnNames.LEGACYFARMERACCOUNT,
    sourceColumnNames.CLAIMSETTLEMENTDATE,
    sourceColumnNames.CLAIMREFNUM,
    sourceColumnNames.ISEURELEVANT,
    sourceColumnNames.FUNDEDBY,
    sourceColumnNames.EUYEARSTARTDATE,
    sourceColumnNames.EUYEARENDDATE,
    sourceColumnNames.YEARENDRUNNUMBER,
    sourceColumnNames.REASON,
    sourceColumnNames.EXCHRATECALCTYPE,
    sourceColumnNames.POSTINGDATE,
    sourceColumnNames.DATAWAREHOUSERUNNUM,
    sourceColumnNames.CROSSCOMPLIANCE,
    sourceColumnNames.PENALTY,
    sourceColumnNames.EXCHFUNDEDEUR,
    sourceColumnNames.EXCHFUNDEDGBP,
    sourceColumnNames.FESTXNNUM,
    sourceColumnNames.FESTXNLINENUM,
    sourceColumnNames.ADVPAYFLAG,
    sourceColumnNames.DAXINVOICENUM,
    sourceColumnNames.DWHTXNTYPE,
    sourceColumnNames.RETENTION,
    sourceColumnNames.DUMMYT104,
    sourceColumnNames.F106GBP,
    sourceColumnNames.SCHEMEEXCHANGERATE,
    sourceColumnNames.AGREEMENTREFERENCE,
    sourceColumnNames.OEDATE,
    sourceColumnNames.SETTLEMENTVOUCHER1,
    sourceColumnNames.ANNEXIITRANSTYPE,
    sourceColumnNames.BPALLOCATIONTYPE,
    sourceColumnNames.SCHEMETYPE,
    sourceColumnNames.APPLICATIONREFERENCE
  ]

  const mapping = [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format },
    { column: sourceColumnNames.TRANSDATE, targetColumn: targetColumnNames.transdate, targetType: DATE, format },
    { column: sourceColumnNames.ACCOUNTTYPE, targetColumn: targetColumnNames.accounttype, targetType: NUMBER },
    { column: sourceColumnNames.INVOICEID, targetColumn: targetColumnNames.invoiceid, targetType: VARCHAR },
    { column: sourceColumnNames.INVOICEDATE, targetColumn: targetColumnNames.invoicedate, targetType: DATE, format },
    { column: sourceColumnNames.SCHEME, targetColumn: targetColumnNames.scheme, targetType: VARCHAR },
    { column: sourceColumnNames.FUND, targetColumn: targetColumnNames.fund, targetType: VARCHAR },
    { column: sourceColumnNames.MARKETINGYEAR, targetColumn: targetColumnNames.marketingyear, targetType: VARCHAR },
    { column: sourceColumnNames.ACCOUNTNUM, targetColumn: targetColumnNames.accountnum, targetType: VARCHAR },
    { column: sourceColumnNames.DELIVERYBODY, targetColumn: targetColumnNames.deliverybody, targetType: VARCHAR },
    { column: sourceColumnNames.ACCRUALSTATUS, targetColumn: targetColumnNames.accrualstatus, targetType: NUMBER },
    { column: sourceColumnNames.SETTLEMENTVOUCHER, targetColumn: targetColumnNames.settlementvoucher, targetType: VARCHAR },
    { column: sourceColumnNames.LINEAMOUNTEUR, targetColumn: targetColumnNames.lineamounteur, targetType: NUMBER },
    { column: sourceColumnNames.LINEAMOUNTMSTGBP, targetColumn: targetColumnNames.lineamountmstgbp, targetType: NUMBER },
    { column: sourceColumnNames.TRANSACTIONTYPE, targetColumn: targetColumnNames.transactiontype, targetType: NUMBER },
    { column: sourceColumnNames.JOURNALNUM, targetColumn: targetColumnNames.journalnum, targetType: VARCHAR },
    { column: sourceColumnNames.JOURNALNAME, targetColumn: targetColumnNames.journalname, targetType: VARCHAR },
    { column: sourceColumnNames.ADMINDEBT, targetColumn: targetColumnNames.admindebt, targetType: NUMBER },
    { column: sourceColumnNames.VOUCHER, targetColumn: targetColumnNames.voucher, targetType: VARCHAR },
    { column: sourceColumnNames.MONTH, targetColumn: targetColumnNames.month, targetType: VARCHAR },
    { column: sourceColumnNames.AMOUNTEUR, targetColumn: targetColumnNames.amounteur, targetType: NUMBER },
    { column: sourceColumnNames.AMOUNTMSTGBP, targetColumn: targetColumnNames.amountmstgbp, targetType: NUMBER },
    { column: sourceColumnNames.QUARTER, targetColumn: targetColumnNames.quarter, targetType: VARCHAR },
    { column: sourceColumnNames.IDVOUCHER, targetColumn: targetColumnNames.idvoucher, targetType: VARCHAR },
    { column: sourceColumnNames.TRANSTXT, targetColumn: targetColumnNames.transtxt, targetType: VARCHAR },
    { column: sourceColumnNames.IRREGULARITYDEBT, targetColumn: targetColumnNames.irregularitydebt, targetType: NUMBER },
    { column: sourceColumnNames.SECTIONTYPE, targetColumn: targetColumnNames.sectiontype, targetType: NUMBER },
    { column: sourceColumnNames.TRANSRECID, targetColumn: targetColumnNames.transrecid, targetType: NUMBER },
    { column: sourceColumnNames.LJTRANSRECID, targetColumn: targetColumnNames.ljtransrecid, targetType: NUMBER },
    { column: sourceColumnNames.GLACCOUNTENTRYRECID, targetColumn: targetColumnNames.glaccountentryrecid, targetType: NUMBER },
    { column: sourceColumnNames.SETTLEMENTRECID, targetColumn: targetColumnNames.settlementrecid, targetType: NUMBER },
    { column: sourceColumnNames.RUNNUMBER, targetColumn: targetColumnNames.runnumber, targetType: VARCHAR },
    { column: sourceColumnNames.REPORTINGTYPE, targetColumn: targetColumnNames.reportingtype, targetType: NUMBER },
    { column: sourceColumnNames.CUSTVENDAC, targetColumn: targetColumnNames.custvendac, targetType: VARCHAR },
    { column: sourceColumnNames.MODIFIEDDATETIME, targetColumn: targetColumnNames.modifieddatetime, targetType: DATE, format },
    { column: sourceColumnNames.MODIFIEDBY, targetColumn: targetColumnNames.modifiedby, targetType: VARCHAR },
    { column: sourceColumnNames.CREATEDDATETIME, targetColumn: targetColumnNames.createddatetime, targetType: DATE, format },
    { column: sourceColumnNames.CREATEDBY, targetColumn: targetColumnNames.createdby, targetType: VARCHAR },
    { column: sourceColumnNames.DATAAREAID, targetColumn: targetColumnNames.dataareaid, targetType: VARCHAR },
    { column: sourceColumnNames.PARTITION_FLD, targetColumn: targetColumnNames.partition, targetType: VARCHAR },
    { column: sourceColumnNames.RECID, targetColumn: targetColumnNames.recid, targetType: NUMBER },
    { column: sourceColumnNames.EURUNNUMBER, targetColumn: targetColumnNames.eurunnumber, targetType: VARCHAR },
    { column: sourceColumnNames.ACCRUALLEDGERDIMENSIONACCOUNT, targetColumn: targetColumnNames.accrualledgerdimensionaccount, targetType: NUMBER },
    { column: sourceColumnNames.ACCRUALGJACCOUNTENTRYRECID, targetColumn: targetColumnNames.accrualgjaccountentryrecid, targetType: NUMBER },
    { column: sourceColumnNames.CURRENCYCODE, targetColumn: targetColumnNames.currencycode, targetType: VARCHAR },
    { column: sourceColumnNames.LEGACYFARMERACCOUNT, targetColumn: targetColumnNames.legacyfarmeraccount, targetType: VARCHAR },
    { column: sourceColumnNames.CLAIMSETTLEMENTDATE, targetColumn: targetColumnNames.claimsettlementdate, targetType: DATE, format },
    { column: sourceColumnNames.CLAIMREFNUM, targetColumn: targetColumnNames.claimrefnum, targetType: VARCHAR },
    { column: sourceColumnNames.ISEURELEVANT, targetColumn: targetColumnNames.iseurelevant, targetType: NUMBER },
    { column: sourceColumnNames.FUNDEDBY, targetColumn: targetColumnNames.fundedby, targetType: NUMBER },
    { column: sourceColumnNames.EUYEARSTARTDATE, targetColumn: targetColumnNames.euyearstartdate, targetType: DATE, format },
    { column: sourceColumnNames.EUYEARENDDATE, targetColumn: targetColumnNames.euyearenddate, targetType: DATE, format },
    { column: sourceColumnNames.YEARENDRUNNUMBER, targetColumn: targetColumnNames.yearendrunnumber, targetType: VARCHAR },
    { column: sourceColumnNames.REASON, targetColumn: targetColumnNames.reason, targetType: VARCHAR },
    { column: sourceColumnNames.EXCHRATECALCTYPE, targetColumn: targetColumnNames.exchratecalctype, targetType: NUMBER },
    { column: sourceColumnNames.POSTINGDATE, targetColumn: targetColumnNames.postingdate, targetType: DATE, format },
    { column: sourceColumnNames.DATAWAREHOUSERUNNUM, targetColumn: targetColumnNames.datawarehouserunnum, targetType: VARCHAR },
    { column: sourceColumnNames.CROSSCOMPLIANCE, targetColumn: targetColumnNames.crosscompliance, targetType: NUMBER },
    { column: sourceColumnNames.PENALTY, targetColumn: targetColumnNames.penalty, targetType: NUMBER },
    { column: sourceColumnNames.EXCHFUNDEDEUR, targetColumn: targetColumnNames.exchfundedeur, targetType: NUMBER },
    { column: sourceColumnNames.EXCHFUNDEDGBP, targetColumn: targetColumnNames.exchfundedgbp, targetType: NUMBER },
    { column: sourceColumnNames.FESTXNNUM, targetColumn: targetColumnNames.festxnnum, targetType: VARCHAR },
    { column: sourceColumnNames.FESTXNLINENUM, targetColumn: targetColumnNames.festxnlinenum, targetType: NUMBER },
    { column: sourceColumnNames.ADVPAYFLAG, targetColumn: targetColumnNames.advpayflag, targetType: NUMBER },
    { column: sourceColumnNames.DAXINVOICENUM, targetColumn: targetColumnNames.daxinvoicenum, targetType: VARCHAR },
    { column: sourceColumnNames.DWHTXNTYPE, targetColumn: targetColumnNames.dwhtxntype, targetType: VARCHAR },
    { column: sourceColumnNames.RETENTION, targetColumn: targetColumnNames.retention, targetType: NUMBER },
    { column: sourceColumnNames.DUMMYT104, targetColumn: targetColumnNames.dummyt104, targetType: NUMBER },
    { column: sourceColumnNames.F106GBP, targetColumn: targetColumnNames.f106gbp, targetType: NUMBER },
    { column: sourceColumnNames.SCHEMEEXCHANGERATE, targetColumn: targetColumnNames.schemeexchangerate, targetType: NUMBER },
    { column: sourceColumnNames.AGREEMENTREFERENCE, targetColumn: targetColumnNames.agreementreference, targetType: VARCHAR },
    { column: sourceColumnNames.OEDATE, targetColumn: targetColumnNames.oedate, targetType: DATE, format },
    { column: sourceColumnNames.SETTLEMENTVOUCHER1, targetColumn: targetColumnNames.settlementvoucher1, targetType: VARCHAR },
    { column: sourceColumnNames.ANNEXIITRANSTYPE, targetColumn: targetColumnNames.annexiitranstype, targetType: NUMBER },
    { column: sourceColumnNames.BPALLOCATIONTYPE, targetColumn: targetColumnNames.bpallocationtype, targetType: NUMBER },
    { column: sourceColumnNames.SCHEMETYPE, targetColumn: targetColumnNames.schemetype, targetType: NUMBER },
    { column: sourceColumnNames.APPLICATIONREFERENCE, targetColumn: targetColumnNames.applicationreference, targetType: VARCHAR }
  ]

  const transformer = [
    {
      column: sourceColumnNames.TRANSTXT,
      find: "'.",
      replace: '',
      all: true
    }
  ]

  return downloadAndProcessFile(folder, financeDAX, columns, mapping, transformer)
}

const stageFinanceDAXDelinked = async () => {
  return stageFinanceDAX(true, 'financeDAXDelinked')
}

module.exports = {
  stageFinanceDAX,
  stageFinanceDAXDelinked
}
