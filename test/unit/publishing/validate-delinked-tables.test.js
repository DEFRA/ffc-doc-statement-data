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

  test('returns false if delinkedCalculation does not contain sbi', () => {
    delete delinkedCalculation.sbi
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain calculationId', () => {
    delete delinkedCalculation.calculationId
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain frn', () => {
    delete delinkedCalculation.frn
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain agreement number', () => {
    delete delinkedCalculation.agreementNumber
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain claim ID', () => {
    delete delinkedCalculation.claimId
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns false if delinkedCalculation does not contain scheme type', () => {
    delete delinkedCalculation.schemeType
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns falsy if delinkedCalculation does not contain calculation date', () => {
    delete delinkedCalculation.calculationDate
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns falsy if delinkedCalculation does not contain invoice number', () => {
    delete delinkedCalculation.invoiceNumber
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns falsy if delinkedCalculation does not contain agreement start', () => {
    delete delinkedCalculation.agreementStart
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
  })
  test('returns falsy if delinkedCalculation does not contain agreement end', () => {
    delete delinkedCalculation.agreementEnd
    const result = validateUpdate(delinkedCalculation, DELINKEDCALCULATION)
    expect(result).toBeFalsy()
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
