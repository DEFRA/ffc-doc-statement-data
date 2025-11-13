const { DAX, TOTAL } = require('../../../app/constants/types')
const validateUpdate = require('../../../app/publishing/validate-update')
const { mockDax1 } = require('../../mocks/dax')
const { mockTotal1 } = require('../../mocks/totals')

describe('validateUpdate for SFI-23 TOTAL', () => {
  let total

  beforeEach(() => {
    total = JSON.parse(JSON.stringify(mockTotal1))
    total.type = TOTAL
  })

  const requiredTotalFields = [
    'sbi',
    'calculationId',
    'frn',
    'agreementNumber',
    'claimId',
    'schemeType',
    'calculationDate',
    'invoiceNumber',
    'agreementStart',
    'agreementEnd'
  ]

  test.each(requiredTotalFields)('returns false if TOTAL is missing %s', (field) => {
    delete total[field]
    expect(validateUpdate(total, TOTAL)).toBeFalsy()
  })
})

describe('validateUpdate for SFI-23 DAX', () => {
  let dax

  beforeEach(() => {
    dax = JSON.parse(JSON.stringify(mockDax1))
    dax.type = DAX
  })

  // Only fields that validator actually requires for DAX
  const requiredDaxFields = [
    'paymentReference',
    'paymentAmount',
    'transactionDate'
  ]

  test.each(requiredDaxFields)('returns false if DAX is missing %s', (field) => {
    delete dax[field]
    expect(validateUpdate(dax, DAX)).toBeFalsy()
  })

  // Optional fields for DAX (allowed to be missing)
  const optionalDaxFields = [
    'paymentPeriod',
    'schemeType',
    'calculationDate',
    'invoiceNumber',
    'agreementStart',
    'agreementEnd'
  ]

  test.each(optionalDaxFields)('returns true if optional DAX field %s is missing', (field) => {
    delete dax[field]
    expect(validateUpdate(dax, DAX)).toBeTruthy()
  })

  test('returns true if all required fields are present', () => {
    expect(validateUpdate(dax, DAX)).toBeTruthy()
  })
})
