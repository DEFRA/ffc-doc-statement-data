const { DAX, TOTALS } = require('../../../app/publishing/types')
const validateUpdate = require('../../../app/publishing/validate-update')
const { mockDax1 } = require('../../mocks/dax')
const { mockAction1 } = require('../../mocks/actions')
const { mockTotal1 } = require('../../mocks/totals')
let dax
let action
let total

describe('validate SFI-23 New Tables', () => {
  beforeEach(() => {
    dax = JSON.parse(JSON.stringify(mockDax1))
    dax.type = DAX
    total = JSON.parse(JSON.stringify(mockTotal1))
    total.totalReference = total.calculationId
    total.type = TOTALS
    action = JSON.parse(JSON.stringify(mockAction1))
    delete total.calculationId
    delete dax.paymentReference
    delete action.actionCode
  })

  test('returns false if total does not contain sbi', () => {
    delete total.sbi
    const result = validateUpdate(total, TOTALS)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain calculationId', () => {
    delete total.calculationId
    const result = validateUpdate(total, TOTALS)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain frn', () => {
    delete total.frn
    const result = validateUpdate(total, TOTALS)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain agreement number', () => {
    delete total.agreementNumber
    const result = validateUpdate(total, TOTALS)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain claim ID', () => {
    delete total.claimId
    const result = validateUpdate(total, TOTALS)
    expect(result).toBeFalsy()
  })
  test('returns false if total does not contain scheme type', () => {
    delete total.schemeType
    const result = validateUpdate(total, TOTALS)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain calculation date', () => {
    delete total.calculationDate
    const result = validateUpdate(total, TOTALS)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain invoice number', () => {
    delete total.invoiceNumber
    const result = validateUpdate(total, TOTALS)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain agreement start', () => {
    delete total.agreementStart
    const result = validateUpdate(total, TOTALS)
    expect(result).toBeFalsy()
  })
  test('returns falsy if total does not contain agreement end', () => {
    delete total.agreementEnd
    const result = validateUpdate(total, TOTALS)
    expect(result).toBeFalsy()
  })
})
