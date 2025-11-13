const { DELINKED_CALCULATION } = require('../../../../app/constants/types')
const validateUpdate = require('../../../../app/publishing/validate-update')
const { mockDelinkedCalculation1 } = require('../../../mocks/delinkedCalculation')

let delinked

describe('validateDelinkedCalculation', () => {
  beforeEach(() => {
    delinked = JSON.parse(JSON.stringify(mockDelinkedCalculation1))
    delinked.type = DELINKED_CALCULATION
  })

  const requiredFields = [
    'sbi',
    'calculationReference',
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
    'updated',
    'datePublished'
  ]

  test.each(requiredFields)(
    'returns false if delinked does not contain %s',
    (field) => {
      delete delinked[field]
      const result = validateUpdate(delinked, DELINKED_CALCULATION)
      expect(result).toBeFalsy()
    }
  )
})
