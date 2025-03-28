const db = require('../../../app/data')
db.sequelize = { col: (col) => col }
db.Sequelize = {
  Op: {
    or: Symbol.for('or'),
    lt: Symbol.for('lt')
  }
}

const getUnpublishedTotals = require('../../../app/publishing/total/get-unpublished-total')
const { mockTotal1, mockTotal2, mockTotal3 } = require('../../mocks/totals')

db.total = {
  findAll: jest.fn()
}

describe('getUnpublishedTotals', () => {
  beforeEach(() => {
    db.total.findAll.mockResolvedValue([mockTotal1, mockTotal2, mockTotal3])
  })

  test('getUnpublishedTotals passes custom limit and offset to db.total.findAll', async () => {
    const transaction = {}
    await getUnpublishedTotals(transaction, 100, 50)

    expect(db.total.findAll).toHaveBeenCalledWith({
      lock: true,
      skipLocked: true,
      where: {
        [db.Sequelize.Op.or]: [
          { datePublished: null },
          { datePublished: { [db.Sequelize.Op.lt]: db.sequelize.col('updated') } }
        ]
      },
      attributes: [
        'calculationId',
        ['calculationId', 'calculationReference'],
        ['calculationId', 'totalsId'],
        'sbi',
        'frn',
        'agreementNumber',
        'claimId',
        ['claimId', 'claimReference'],
        'schemeType',
        'calculationDate',
        'invoiceNumber',
        'agreementStart',
        'agreementEnd',
        'totalAdditionalPayments',
        'totalActionPayments',
        'totalPayments',
        'updated',
        'datePublished'
      ],
      raw: true,
      limit: 100,
      offset: 50,
      transaction
    })
  })

  test('getUnpublishedTotals returns the correct data', async () => {
    const transaction = {}
    const result = await getUnpublishedTotals(transaction, 250, 0)
    expect(result).toEqual([mockTotal1, mockTotal2, mockTotal3])

    expect(db.total.findAll).toHaveBeenCalledWith({
      lock: true,
      skipLocked: true,
      where: {
        [db.Sequelize.Op.or]: [
          { datePublished: null },
          { datePublished: { [db.Sequelize.Op.lt]: db.sequelize.col('updated') } }
        ]
      },
      attributes: [
        'calculationId',
        ['calculationId', 'calculationReference'],
        ['calculationId', 'totalsId'],
        'sbi',
        'frn',
        'agreementNumber',
        'claimId',
        ['claimId', 'claimReference'],
        'schemeType',
        'calculationDate',
        'invoiceNumber',
        'agreementStart',
        'agreementEnd',
        'totalAdditionalPayments',
        'totalActionPayments',
        'totalPayments',
        'updated',
        'datePublished'
      ],
      raw: true,
      limit: 250,
      offset: 0,
      transaction
    })
  })
})
