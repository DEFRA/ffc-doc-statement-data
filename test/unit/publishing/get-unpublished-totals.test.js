const db = require('../../../app/data')
const getUnpublishedTotals = require('../../../app/publishing/total/get-unpublished-total')
const { mockTotal1, mockTotal2, mockTotal3 } = require('../../mocks/totals')

db.total = {
  findAll: jest.fn()
}

describe('getUnpublishedTotals', () => {
  beforeEach(() => {
    db.total.findAll.mockResolvedValue([mockTotal1, mockTotal2, mockTotal3])
  })

  test('getUnpublishedTotals returns the correct data', async () => {
    const transaction = {}
    const result = await getUnpublishedTotals(transaction)
    expect(result).toEqual([mockTotal1, mockTotal2, mockTotal3])

    expect(db.total.findAll).toHaveBeenCalledWith({
      lock: true,
      skipLocked: true,
      limit: expect.any(Number),
      where: {
        [db.Sequelize.Op.or]: [
          {
            datePublished: null
          },
          {
            datePublished: { [db.Sequelize.Op.lt]: db.sequelize.col('updated') }
          }
        ]
      },
      attributes: ['calculationId', ['calculationId', 'calculationReference'], ['calculationId', 'totalsId'], 'sbi', 'frn', 'agreementNumber', 'claimId', ['claimId', 'claimReference'], 'schemeType', 'calculationDate', 'invoiceNumber', 'agreementStart', 'agreementEnd', 'totalAdditionalPayments', 'totalActionPayments', 'totalPayments', 'updated', 'datePublished'],
      raw: true,
      transaction
    })
  })
})
