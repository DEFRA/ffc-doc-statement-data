const { DAX, TOTAL } = require('../../../app/constants/types')
const validateUpdate = require('../../../app/publishing/validate-update')
const { mockDax1 } = require('../../mocks/dax')
const { mockTotal1 } = require('../../mocks/totals')
let dax
let total

describe('validate SFI-23 TOTAL', () => {
  beforeEach(() => {
    total = JSON.parse(JSON.stringify(mockTotal1))
    total.type = TOTAL
  })

  test('returns false if total does not contain sbi', () => {
    delete total.sbi
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain calculationId', () => {
    delete total.calculationId
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain frn', () => {
    delete total.frn
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain agreement number', () => {
    delete total.agreementNumber
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain claim ID', () => {
    delete total.claimId
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain scheme type', () => {
    delete total.schemeType
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain calculation date', () => {
    delete total.calculationDate
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain invoice number', () => {
    delete total.invoiceNumber
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain agreement start', () => {
    delete total.agreementStart
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain agreement end', () => {
    delete total.agreementEnd
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
})
describe('validate SFI-23 DAX', () => {
  beforeEach(() => {
    dax = JSON.parse(JSON.stringify(mockDax1))
    dax.type = DAX
  })

  test('returns false if total does not contain payment reference', () => {
    delete dax.paymentReference
    const result = validateUpdate(dax, DAX)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain payment period', () => {
    delete dax.paymentPeriod
    const result = validateUpdate(dax, DAX)
    expect(result).not.toBeFalsy()
  })
  test('returns false if total does not contain payment amount', () => {
    delete dax.paymentAmount
    const result = validateUpdate(dax, DAX)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain transactionDate', () => {
    delete dax.transactionDate
    const result = validateUpdate(dax, DAX)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain scheme type', () => {
    delete dax.schemeType
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain calculation date', () => {
    delete dax.calculationDate
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain invoice number', () => {
    delete dax.invoiceNumber
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain agreement start', () => {
    delete total.agreementStart
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain agreement end', () => {
    delete total.agreementEnd
    const result = validateUpdate(total, TOTAL)
    expect(result).toBeFalsy()
  })
})
