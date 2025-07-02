const db = require('../../data')

const getSubsetDelinkedCalculation = async (calculationIdArray) => {
  const delinkedCalculations = await db.delinkedCalculation.findAll({
    lock: true,
    skipLocked: true,
    where: {
      [db.Sequelize.Op.and]: [
        {
          calculationId: { [db.Sequelize.Op.in]: calculationIdArray }
        },
        {
          [db.Sequelize.Op.or]: [
            { datePublished: null },
            { datePublished: { [db.Sequelize.Op.lt]: db.sequelize.col('updated') } }
          ]
        }
      ]
    },
    attributes: [
      ['applicationId', 'applicationReference'],
      ['calculationId', 'calculationReference'],
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
    ],
    raw: true
  })

  const unpublished = []

  for (const item of delinkedCalculations) {
    if (item.calculationReference) {
      unpublished.push({
        ...item,
        calculationId: item.calculationReference, // Map calculationReference to calculationId
        applicationId: item.applicationReference // Map applicationReference to applicationId
      })
    } else {
      console.error('Missing calculationReference for item:', item)
    }
  }

  return unpublished
}

module.exports = getSubsetDelinkedCalculation
