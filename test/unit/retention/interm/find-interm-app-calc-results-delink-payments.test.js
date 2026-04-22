const db = require('../../../../app/data')
const { findIntermAppCalcResultsDelinkPayments } = require('../../../../app/retention/interm/find-interm-app-calc-results-delink-payments')

jest.mock('../../../../app/data', () => ({
  etlIntermAppCalcResultsDelinkPayment: {
    findAll: jest.fn()
  }
}))

describe('findIntermAppCalcResultsDelinkPayments', () => {
  const applicationId = 'APP-2020'
  const frn = 987654
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermAppCalcResultsDelinkPayment.findAll with correct parameters', async () => {
    const mockResult = [
      { calculationId: 11 },
      { calculationId: 22 }
    ]
    db.etlIntermAppCalcResultsDelinkPayment.findAll.mockResolvedValue(mockResult)

    const result = await findIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)

    expect(db.etlIntermAppCalcResultsDelinkPayment.findAll).toHaveBeenCalledTimes(1)
    expect(db.etlIntermAppCalcResultsDelinkPayment.findAll).toHaveBeenCalledWith({
      attributes: ['calculationId'],
      where: {
        applicationId,
        frn
      },
      transaction
    })
    expect(result).toBe(mockResult)
  })

  test('returns empty array when no records found', async () => {
    db.etlIntermAppCalcResultsDelinkPayment.findAll.mockResolvedValue([])

    const result = await findIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)

    expect(db.etlIntermAppCalcResultsDelinkPayment.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual([])
  })

  test('propagates error when db.etlIntermAppCalcResultsDelinkPayment.findAll rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermAppCalcResultsDelinkPayment.findAll.mockRejectedValue(error)

    await expect(findIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)).rejects.toThrow('DB error')
  })
})
