const { DELINKED_CALCULATION } = require('../../../../app/constants/types')
const validateUpdate = require('../../../../app/publishing/validate-update')
const { mockDelinkedCalculation1 } = require('../../../mocks/delinkedCalculation')
let delinked

describe('validate DELINKED_CALCULATION', () => {
  beforeEach(() => {
    delinked = JSON.parse(JSON.stringify(mockDelinkedCalculation1))
    delinked.type = DELINKED_CALCULATION
  })

  test('returns false if delinked does not contain sbi', () => {
    delete delinked.sbi
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain calculationReference', () => {
    delete delinked.calculationReference
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain frn', () => {
    delete delinked.frn
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain paymentBand1', () => {
    delete delinked.paymentBand1
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain paymentBand2', () => {
    delete delinked.paymentBand2
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain paymentBand3', () => {
    delete delinked.paymentBand3
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain paymentBand4', () => {
    delete delinked.paymentBand4
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain percentageReduction1', () => {
    delete delinked.percentageReduction1
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain percentageReduction2', () => {
    delete delinked.percentageReduction2
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain percentageReduction3', () => {
    delete delinked.percentageReduction3
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain percentageReduction4', () => {
    delete delinked.percentageReduction4
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain progressiveReductions1', () => {
    delete delinked.progressiveReductions1
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain progressiveReductions2', () => {
    delete delinked.progressiveReductions2
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain progressiveReductions3', () => {
    delete delinked.progressiveReductions3
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain progressiveReductions4', () => {
    delete delinked.progressiveReductions4
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain referenceAmount', () => {
    delete delinked.referenceAmount
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain totalProgressiveReduction', () => {
    delete delinked.totalProgressiveReduction
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain totalDelinkedPayment', () => {
    delete delinked.totalDelinkedPayment
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain paymentAmountCalculated', () => {
    delete delinked.paymentAmountCalculated
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain updated', () => {
    delete delinked.updated
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinked does not contain datePublished', () => {
    delete delinked.datePublished
    const result = validateUpdate(delinked, DELINKED_CALCULATION)
    expect(result).toBeFalsy()
  })
})
