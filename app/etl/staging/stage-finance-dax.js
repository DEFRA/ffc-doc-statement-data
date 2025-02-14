const { financeDAXTable } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat } = require('./stage-utils')

const stageFinanceDAX = async () => {
  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'TRANSDATE',
    'ACCOUNTTYPE',
    'INVOICEID',
    'INVOICEDATE',
    'SCHEME',
    'FUND',
    'MARKETINGYEAR',
    'ACCOUNTNUM',
    'DELIVERYBODY',
    'ACCRUALSTATUS',
    'SETTLEMENTVOUCHER',
    'LINEAMOUNTEUR',
    'LINEAMOUNTMSTGBP',
    'TRANSACTIONTYPE',
    'JOURNALNUM',
    'JOURNALNAME',
    'ADMINDEBT',
    'VOUCHER',
    'MONTH',
    'AMOUNTEUR',
    'AMOUNTMSTGBP',
    'QUARTER',
    'IDVOUCHER',
    'TRANSTXT',
    'IRREGULARITYDEBT',
    'SECTIONTYPE',
    'TRANSRECID',
    'LJTRANSRECID',
    'GLACCOUNTENTRYRECID',
    'SETTLEMENTRECID',
    'RUNNUMBER',
    'REPORTINGTYPE',
    'CUSTVENDAC',
    'MODIFIEDDATETIME',
    'MODIFIEDBY',
    'CREATEDDATETIME',
    'CREATEDBY',
    'DATAAREAID',
    'PARTITION_FLD',
    'RECID',
    'EURUNNUMBER',
    'ACCRUALLEDGERDIMENSIONACCOUNT',
    'ACCRUALGJACCOUNTENTRYRECID',
    'CURRENCYCODE',
    'LEGACYFARMERACCOUNT',
    'CLAIMSETTLEMENTDATE',
    'CLAIMREFNUM',
    'ISEURELEVANT',
    'FUNDEDBY',
    'EUYEARSTARTDATE',
    'EUYEARENDDATE',
    'YEARENDRUNNUMBER',
    'REASON',
    'EXCHRATECALCTYPE',
    'POSTINGDATE',
    'DATAWAREHOUSERUNNUM',
    'CROSSCOMPLIANCE',
    'PENALTY',
    'EXCHFUNDEDEUR',
    'EXCHFUNDEDGBP',
    'FESTXNNUM',
    'FESTXNLINENUM',
    'ADVPAYFLAG',
    'DAXINVOICENUM',
    'DWHTXNTYPE',
    'RETENTION',
    'DUMMYT104',
    'F106GBP',
    'SCHEMEEXCHANGERATE',
    'AGREEMENTREFERENCE',
    'OEDATE',
    'SETTLEMENTVOUCHER1',
    'ANNEXIITRANSTYPE',
    'BPALLOCATIONTYPE',
    'SCHEMETYPE',
    'APPLICATIONREFERENCE'
  ]

  const mapping = [
    {
      column: 'CHANGE_TYPE',
      targetColumn: 'change_type',
      targetType: 'varchar'
    },
    {
      column: 'CHANGE_TIME',
      targetColumn: 'change_time',
      targetType: 'date',
      format: dateTimeFormat
    },
    {
      column: 'TRANSDATE',
      targetColumn: 'transdate',
      targetType: 'date',
      format: dateTimeFormat
    },
    {
      column: 'ACCOUNTTYPE',
      targetColumn: 'accounttype',
      targetType: 'number'
    },
    {
      column: 'INVOICEID',
      targetColumn: 'invoiceid',
      targetType: 'varchar'
    },
    {
      column: 'INVOICEDATE',
      targetColumn: 'invoicedate',
      targetType: 'date',
      format: dateTimeFormat
    },
    {
      column: 'SCHEME',
      targetColumn: 'scheme',
      targetType: 'varchar'
    },
    {
      column: 'FUND',
      targetColumn: 'fund',
      targetType: 'varchar'
    },
    {
      column: 'MARKETINGYEAR',
      targetColumn: 'marketingyear',
      targetType: 'varchar'
    },
    {
      column: 'ACCOUNTNUM',
      targetColumn: 'accountnum',
      targetType: 'varchar'
    },
    {
      column: 'DELIVERYBODY',
      targetColumn: 'deliverybody',
      targetType: 'varchar'
    },
    {
      column: 'ACCRUALSTATUS',
      targetColumn: 'accrualstatus',
      targetType: 'number'
    },
    {
      column: 'SETTLEMENTVOUCHER',
      targetColumn: 'settlementvoucher',
      targetType: 'varchar'
    },
    {
      column: 'LINEAMOUNTEUR',
      targetColumn: 'lineamounteur',
      targetType: 'number'
    },
    {
      column: 'LINEAMOUNTMSTGBP',
      targetColumn: 'lineamountmstgbp',
      targetType: 'number'
    },
    {
      column: 'TRANSACTIONTYPE',
      targetColumn: 'transactiontype',
      targetType: 'number'
    },
    {
      column: 'JOURNALNUM',
      targetColumn: 'journalnum',
      targetType: 'varchar'
    },
    {
      column: 'JOURNALNAME',
      targetColumn: 'journalname',
      targetType: 'varchar'
    },
    {
      column: 'ADMINDEBT',
      targetColumn: 'admindebt',
      targetType: 'number'
    },
    {
      column: 'VOUCHER',
      targetColumn: 'voucher',
      targetType: 'varchar'
    },
    {
      column: 'MONTH',
      targetColumn: 'month',
      targetType: 'varchar'
    },
    {
      column: 'AMOUNTEUR',
      targetColumn: 'amounteur',
      targetType: 'number'
    },
    {
      column: 'AMOUNTMSTGBP',
      targetColumn: 'amountmstgbp',
      targetType: 'number'
    },
    {
      column: 'QUARTER',
      targetColumn: 'quarter',
      targetType: 'varchar'
    },
    {
      column: 'IDVOUCHER',
      targetColumn: 'idvoucher',
      targetType: 'varchar'
    },
    {
      column: 'TRANSTXT',
      targetColumn: 'transtxt',
      targetType: 'varchar'
    },
    {
      column: 'IRREGULARITYDEBT',
      targetColumn: 'irregularitydebt',
      targetType: 'number'
    },
    {
      column: 'SECTIONTYPE',
      targetColumn: 'sectiontype',
      targetType: 'number'
    },
    {
      column: 'TRANSRECID',
      targetColumn: 'transrecid',
      targetType: 'number'
    },
    {
      column: 'LJTRANSRECID',
      targetColumn: 'ljtransrecid',
      targetType: 'number'
    },
    {
      column: 'GLACCOUNTENTRYRECID',
      targetColumn: 'glaccountentryrecid',
      targetType: 'number'
    },
    {
      column: 'SETTLEMENTRECID',
      targetColumn: 'settlementrecid',
      targetType: 'number'
    },
    {
      column: 'RUNNUMBER',
      targetColumn: 'runnumber',
      targetType: 'varchar'
    },
    {
      column: 'REPORTINGTYPE',
      targetColumn: 'reportingtype',
      targetType: 'number'
    },
    {
      column: 'CUSTVENDAC',
      targetColumn: 'custvendac',
      targetType: 'varchar'
    },
    {
      column: 'MODIFIEDDATETIME',
      targetColumn: 'modifieddatetime',
      targetType: 'date',
      format: dateTimeFormat
    },
    {
      column: 'MODIFIEDBY',
      targetColumn: 'modifiedby',
      targetType: 'varchar'
    },
    {
      column: 'CREATEDDATETIME',
      targetColumn: 'createddatetime',
      targetType: 'date',
      format: dateTimeFormat
    },
    {
      column: 'CREATEDBY',
      targetColumn: 'createdby',
      targetType: 'varchar'
    },
    {
      column: 'DATAAREAID',
      targetColumn: 'dataareaid',
      targetType: 'varchar'
    },
    {
      column: 'PARTITION_FLD',
      targetColumn: 'partition',
      targetType: 'varchar'
    },
    {
      column: 'RECID',
      targetColumn: 'recid',
      targetType: 'number'
    },
    {
      column: 'EURUNNUMBER',
      targetColumn: 'eurunnumber',
      targetType: 'varchar'
    },
    {
      column: 'ACCRUALLEDGERDIMENSIONACCOUNT',
      targetColumn: 'accrualledgerdimensionaccount',
      targetType: 'number'
    },
    {
      column: 'ACCRUALGJACCOUNTENTRYRECID',
      targetColumn: 'accrualgjaccountentryrecid',
      targetType: 'number'
    },
    {
      column: 'CURRENCYCODE',
      targetColumn: 'currencycode',
      targetType: 'varchar'
    },
    {
      column: 'LEGACYFARMERACCOUNT',
      targetColumn: 'legacyfarmeraccount',
      targetType: 'varchar'
    },
    {
      column: 'CLAIMSETTLEMENTDATE',
      targetColumn: 'claimsettlementdate',
      targetType: 'date',
      format: dateTimeFormat
    },
    {
      column: 'CLAIMREFNUM',
      targetColumn: 'claimrefnum',
      targetType: 'varchar'
    },
    {
      column: 'ISEURELEVANT',
      targetColumn: 'iseurelevant',
      targetType: 'number'
    },
    {
      column: 'FUNDEDBY',
      targetColumn: 'fundedby',
      targetType: 'number'
    },
    {
      column: 'EUYEARSTARTDATE',
      targetColumn: 'euyearstartdate',
      targetType: 'date',
      format: dateTimeFormat
    },
    {
      column: 'EUYEARENDDATE',
      targetColumn: 'euyearenddate',
      targetType: 'date',
      format: dateTimeFormat
    },
    {
      column: 'YEARENDRUNNUMBER',
      targetColumn: 'yearendrunnumber',
      targetType: 'varchar'
    },
    {
      column: 'REASON',
      targetColumn: 'reason',
      targetType: 'varchar'
    },
    {
      column: 'EXCHRATECALCTYPE',
      targetColumn: 'exchratecalctype',
      targetType: 'number'
    },
    {
      column: 'POSTINGDATE',
      targetColumn: 'postingdate',
      targetType: 'date',
      format: dateTimeFormat
    },
    {
      column: 'DATAWAREHOUSERUNNUM',
      targetColumn: 'datawarehouserunnum',
      targetType: 'varchar'
    },
    {
      column: 'CROSSCOMPLIANCE',
      targetColumn: 'crosscompliance',
      targetType: 'number'
    },
    {
      column: 'PENALTY',
      targetColumn: 'penalty',
      targetType: 'number'
    },
    {
      column: 'EXCHFUNDEDEUR',
      targetColumn: 'exchfundedeur',
      targetType: 'number'
    },
    {
      column: 'EXCHFUNDEDGBP',
      targetColumn: 'exchfundedgbp',
      targetType: 'number'
    },
    {
      column: 'FESTXNNUM',
      targetColumn: 'festxnnum',
      targetType: 'varchar'
    },
    {
      column: 'FESTXNLINENUM',
      targetColumn: 'festxnlinenum',
      targetType: 'number'
    },
    {
      column: 'ADVPAYFLAG',
      targetColumn: 'advpayflag',
      targetType: 'number'
    },
    {
      column: 'DAXINVOICENUM',
      targetColumn: 'daxinvoicenum',
      targetType: 'varchar'
    },
    {
      column: 'DWHTXNTYPE',
      targetColumn: 'dwhtxntype',
      targetType: 'varchar'
    },
    {
      column: 'RETENTION',
      targetColumn: 'retention',
      targetType: 'number'
    },
    {
      column: 'DUMMYT104',
      targetColumn: 'dummyt104',
      targetType: 'number'
    },
    {
      column: 'F106GBP',
      targetColumn: 'f106gbp',
      targetType: 'number'
    },
    {
      column: 'SCHEMEEXCHANGERATE',
      targetColumn: 'schemeexchangerate',
      targetType: 'number'
    },
    {
      column: 'AGREEMENTREFERENCE',
      targetColumn: 'agreementreference',
      targetType: 'varchar'
    },
    {
      column: 'OEDATE',
      targetColumn: 'oedate',
      targetType: 'date',
      format: dateTimeFormat
    },
    {
      column: 'SETTLEMENTVOUCHER1',
      targetColumn: 'settlementvoucher1',
      targetType: 'varchar'
    },
    {
      column: 'ANNEXIITRANSTYPE',
      targetColumn: 'annexiitranstype',
      targetType: 'number'
    },
    {
      column: 'BPALLOCATIONTYPE',
      targetColumn: 'bpallocationtype',
      targetType: 'number'
    },
    {
      column: 'SCHEMETYPE',
      targetColumn: 'schemetype',
      targetType: 'number'
    },
    {
      column: 'APPLICATIONREFERENCE',
      targetColumn: 'applicationreference',
      targetType: 'varchar'
    }
  ]

  const transformer = [
    {
      column: 'TRANSTXT',
      find: "'.",
      replace: '',
      all: true
    }
  ]

  return downloadAndProcessFile('financeDAX', 'financeDAX', financeDAXTable, columns, mapping, transformer)
}

module.exports = {
  stageFinanceDAX
}
