const db = require('../../database')

const getSubsetDelinkedCalculation = async (calculationIdArray) => {
  const delinkedCalculations = await db.delinkedCalculation()
    .whereIn('calculationId', calculationIdArray)
    .where(function () {
      this.whereNull('datePublished').orWhereRaw('"datePublished" < "updated"')
    })
    .select(
      { applicationReference: 'applicationId' },
      { calculationReference: 'calculationId' },
      'sbi',
      'frn',
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
    )
    .forUpdate()
    .skipLocked()

  const unpublished = []

  for (const item of delinkedCalculations) {
    if (item.calculationReference) {
      unpublished.push({
        ...item,
        calculationId: item.calculationReference, // Map calculationReference to calculationId
        applicationId: item.applicationReference // Map applicationReference to applicationId
      })
    } else {
      console.error(`Missing calculationReference for item: sbi: ${item.sbi}, frn: ${item.frn}, applicationReference: ${item.applicationReference}`)
    }
  }

  return unpublished
}

module.exports = getSubsetDelinkedCalculation
