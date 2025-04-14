const db = require('../../../app/data')
const { publishingConfig } = require('../../../app/config')

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
    const limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource
    await getUnpublishedTotals(transaction, limit)

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
      transaction,
      limit
    })
  })

  test('getUnpublishedTotals returns the correct data', async () => {
    const transaction = {}
    const limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource
    const result = await getUnpublishedTotals(transaction, limit)
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
      transaction,
      limit
    })
  })
})
