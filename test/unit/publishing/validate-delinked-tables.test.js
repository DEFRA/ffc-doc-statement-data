const { DAX, DELINKEDCALCULATION } = require('../../../app/publishing/types')
const validateUpdate = require('../../../app/publishing/validate-update')
const { mockDaxDelinked1 } = require('../../mocks/dax')
const { mockDelinkedCalculation1 } = require('../../mocks/delinkedCalculation')
let dax
let delinkedCalculation

describe('validate delinked against delinkedCalculation', () => {
  beforeEach(() => {
    delinkedCalculation = JSON.parse(JSON.stringify(mockDelinkedCalculation1))
    delinkedCalculation.type = DELINKEDCALCULATION
  })
  test('returns false if delinkedCalculation does not contain applicationId', () => {
    delete delinkedCalculation.applicationId
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain calculationId', () => {
    delete delinkedCalculation.calculationId
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain sbi', () => {
    delete delinkedCalculation.sbi
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain frn', () => {
    delete delinkedCalculation.frn
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain payment Band 1', () => {
    delete delinkedCalculation.paymentBand1
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain payment Band 2', () => {
    delete delinkedCalculation.paymentBand2
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain payment Band 3', () => {
    delete delinkedCalculation.paymentBand3
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain payment Band 4', () => {
    delete delinkedCalculation.paymentBand4
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain percentageReduction1', () => {
    delete delinkedCalculation.percentageReduction1
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain percentageReduction2', () => {
    delete delinkedCalculation.percentageReduction2
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain percentageReduction3', () => {
    delete delinkedCalculation.percentageReduction3
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain percentageReduction4', () => {
    delete delinkedCalculation.percentageReduction4
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain progressiveReductions1', () => {
    delete delinkedCalculation.progressiveReductions1
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain progressiveReductions2', () => {
    delete delinkedCalculation.progressiveReductions2
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain progressiveReductions3', () => {
    delete delinkedCalculation.progressiveReductions3
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain progressiveReductions4', () => {
    delete delinkedCalculation.progressiveReductions4
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns falsy if delinkedCalculation does not contain referenceAmount', () => {
    delete delinkedCalculation.referenceAmount
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns falsy if delinkedCalculation does not contain totalProgressiveReduction', () => {
    delete delinkedCalculation.totalProgressiveReduction
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns falsy if delinkedCalculation does not contain totalDelinkedPayment', () => {
    delete delinkedCalculation.totalDelinkedPayment
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns falsy if delinkedCalculation does not contain paymentAmountCalculated', () => {
    delete delinkedCalculation.paymentAmountCalculated
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns falsy if delinkedCalculation does not contain updated date', () => {
    delete delinkedCalculation.updated
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeTruthy()
  })
})
describe('validate delinked DAX', () => {
  beforeEach(() => {
    dax = JSON.parse(JSON.stringify(mockDaxDelinked1))
    dax.type = DAX
  })

  test('returns false if delinkedCalculation does not contain payment reference', () => {
    delete dax.paymentReference
    const result = validateUpdate(dax, DAX)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain calculationId', () => {
    delete dax.calculationId
    const result = validateUpdate(dax, DAX)
    expect(result).not.toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain payment period', () => {
    delete dax.paymentPeriod
    const result = validateUpdate(dax, DAX)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain payment amount', () => {
    delete dax.paymentAmount
    const result = validateUpdate(dax, DAX)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain transactionDate', () => {
    delete dax.transactionDate
    const result = validateUpdate(dax, DAX)
    expect(result).toBeFalsy()
  })
})
