const TABLES = require('./tables')
const ETL_TABLES = require('./etl-tables')

const PRIMARY_KEYS = {
  [TABLES.zeroValueD365]: 'd365Id',
  [ETL_TABLES.etlStageLog]: 'etlId'
}

const COLUMNS = {
  [TABLES.action]: [
    'actionId',
    'calculationId',
    'fundingCode',
    'groupName',
    'actionCode',
    'actionName',
    'rate',
    'landArea',
    'uom',
    'annualValue',
    'quarterlyValue',
    'overDeclarationPenalty',
    'quarterlyPaymentAmount',
    'datePublished'
  ],
  [TABLES.d365]: [
    'paymentReference',
    'calculationId',
    'paymentPeriod',
    'paymentAmount',
    'transactionDate',
    'datePublished',
    'd365Id',
    'marketingYear'
  ],
  [TABLES.dax]: [
    'paymentReference',
    'calculationId',
    'paymentPeriod',
    'paymentAmount',
    'transactionDate',
    'datePublished',
    'daxId'
  ],
  [TABLES.delinkedCalculation]: [
    'calculationId',
    'applicationId',
    'frn',
    'sbi',
    'paymentBand1',
    'paymentBand2',
    'paymentBand3',
    'paymentBand4',
    'percentageReduction1',
    'percentageReduction2',
    'percentageReduction3',
    'percentageReduction4',
    'progressiveReductions1',
    'progressiveReductions2',
    'progressiveReductions3',
    'progressiveReductions4',
    'referenceAmount',
    'totalProgressiveReduction',
    'totalDelinkedPayment',
    'paymentAmountCalculated',
    'datePublished',
    'updated'
  ],
  [TABLES.organisations]: [
    'sbi',
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'county',
    'postcode',
    'emailAddress',
    'frn',
    'name',
    'updated',
    'published'
  ],
  [TABLES.subsetCheck]: [
    'scheme',
    'subsetSent'
  ],
  [TABLES.total]: [
    'calculationId',
    'sbi',
    'frn',
    'agreementNumber',
    'claimId',
    'schemeType',
    'calculationDate',
    'invoiceNumber',
    'agreementStart',
    'agreementEnd',
    'totalAdditionalPayments',
    'totalActionPayments',
    'updated',
    'datePublished',
    'totalPayments'
  ],
  [TABLES.zeroValueD365]: [
    'd365Id',
    'paymentReference',
    'calculationId',
    'paymentPeriod',
    'paymentAmount',
    'transactionDate',
    'marketingYear',
    'dateCreated',
    'alertSent'
  ],
  [ETL_TABLES.appCalcResultsDelinkPayments]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'PKID',
    'calculationId',
    'variableName',
    'progLine',
    'VALUE'
  ],
  [ETL_TABLES.applicationDetailDelinked]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'pkid',
    'applicationId',
    'subjectId'
  ],
  [ETL_TABLES.appsPaymentNotificationDelinked]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'applicationId',
    'idClcHeader',
    'notificationFlag',
    'invoiceNumber'
  ],
  [ETL_TABLES.appsTypesDelinked]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt'
  ],
  [ETL_TABLES.businessAddressDelinked]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'sbi',
    'frn',
    'businessName',
    'businessAddress1',
    'businessAddress2',
    'businessAddress3',
    'businessCity',
    'businessCounty',
    'businessPostCode',
    'businessEmailAddr'
  ],
  [ETL_TABLES.calculationsDetailsDelinked]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'applicationId',
    'idClcHeader',
    'calculationId',
    'calculationDt',
    'ranked'
  ],
  [ETL_TABLES.cssContractApplicationsDelinked]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'cssContractApplicationWid',
    'pkid',
    'contractId',
    'applicationId',
    'dataSourceSCode',
    'startDt',
    'endDt'
  ],
  [ETL_TABLES.cssContractDelinked]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'cssContractWid',
    'pkid',
    'contractId',
    'contractStateSCode',
    'dataSourceSCode',
    'startDt',
    'endDt'
  ],
  [ETL_TABLES.cssOptionsDelinked]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'cssOptionId',
    'startDt',
    'endDt'
  ],
  [ETL_TABLES.defraLinksDelinked]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'defraLinksWid',
    'subjectId',
    'defraId'
  ],
  [ETL_TABLES.etlIntermAppCalcResultsDelinkPayments]: [
    'calculationId',
    'applicationId',
    'frn',
    'sbi',
    'paymentBand1',
    'paymentBand2',
    'paymentBand3',
    'paymentBand4',
    'percentageReduction1',
    'percentageReduction2',
    'percentageReduction3',
    'percentageReduction4',
    'progressiveReductions1',
    'progressiveReductions2',
    'progressiveReductions3',
    'progressiveReductions4',
    'referenceAmount',
    'totalProgressiveReduction',
    'totalDelinkedPayment',
    'paymentAmountCalculated',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermApplicationClaim]: [
    'contractId',
    'claimId',
    'agreementId',
    'pkid',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermApplicationContract]: [
    'contractId',
    'agreementStart',
    'agreementEnd',
    'applicationId',
    'pkid',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermApplicationPayment]: [
    'applicationId',
    'invoiceNumber',
    'invoiceId',
    'idClcHeader',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermCalcOrg]: [
    'applicationId',
    'calculationId',
    'calculationDate',
    'sbi',
    'frn',
    'idClcHeader',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermFinanceDax]: [
    'transdate',
    'invoiceid',
    'scheme',
    'fund',
    'marketingyear',
    'month',
    'quarter',
    'transactionAmount',
    'agreementreference',
    'sitiInvoiceId',
    'claimId',
    'paymentRef',
    'recid',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermOrg]: [
    'sbi',
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'county',
    'postcode',
    'emailAddress',
    'frn',
    'name',
    'partyId',
    'updated',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermPaymentrefAgreementDates]: [
    'paymentRef',
    'agreementStart',
    'agreementEnd',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermPaymentrefApplication]: [
    'paymentRef',
    'applicationId',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermPaymentrefOrg]: [
    'paymentRef',
    'sbi',
    'frn',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermTotal]: [
    'paymentRef',
    'quarter',
    'totalAmount',
    'transdate',
    'calculationId',
    'invoiceid',
    'etlInsertedDt',
    'marketingyear'
  ],
  [ETL_TABLES.etlIntermTotalClaim]: [
    'paymentRef',
    'claimId',
    'etlInsertedDt'
  ],
  [ETL_TABLES.etlIntermTotalZeroValues]: [
    'paymentRef',
    'quarter',
    'totalAmount',
    'transdate',
    'calculationId',
    'invoiceid',
    'etlInsertedDt',
    'marketingyear'
  ],
  [ETL_TABLES.etlStageFinanceDax]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'financeDaxWid',
    'transdate',
    'invoiceid',
    'scheme',
    'fund',
    'marketingyear',
    'accountnum',
    'settlementvoucher',
    'lineamountmstgbp',
    'month',
    'amountmstgbp',
    'quarter',
    'custvendac',
    'recid',
    'agreementreference',
    'schemetype'
  ],
  [ETL_TABLES.etlStageLog]: [
    'etlId',
    'etlInsertedDt',
    'file',
    'startedAt',
    'endedAt',
    'rowCount',
    'rowsLoadedCount',
    'idFrom',
    'idTo'
  ],
  [ETL_TABLES.etlStageOrganisation]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'organisationWid',
    'partyId',
    'sbi',
    'lastUpdatedOn'
  ],
  [ETL_TABLES.etlStageTclcPiiPayClaimSfimtOption]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'tclcPiiPayClaimSfimtOptionWid',
    'applicationId',
    'calculationId'
  ],
  [ETL_TABLES.etlStageTdeLinkingTransferTransactions]: [
    'changeType',
    'changeTime',
    'etlId',
    'etlInsertedDt',
    'transferorSbi',
    'transferorCuaa',
    'transferorPkCuaa',
    'transfereeSbi',
    'transfereeCuaa',
    'transfereePkCuaa',
    'totalAmountTransferred',
    'transferAmount',
    'transferAmountTransIn',
    'dtInsert',
    'dtDelete',
    'dateOfTransfer',
    'statusPCode',
    'statusSCode',
    'transferApplicationId',
    'userInsert',
    'userDelete',
    'dtUpdate',
    'dataSourcePCode',
    'dataSourceSCode'
  ]
}

const pickColumns = (record, table) => {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([column]) => COLUMNS[table].includes(column))
      .filter(([column]) => column !== PRIMARY_KEYS[table])
  )
}

module.exports = {
  PRIMARY_KEYS,
  COLUMNS,
  pickColumns
}
