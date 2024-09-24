const db = require('../../../app/data')
const getUnpublishedDelinked = require('../../../app/publishing/delinkedCalculation/get-unpublished-delinked')
const { mockTotal1, mockTotal2, mockTotal3 } = require('../../mocks/delinkedCalculation')

db.delinkedCalculation = {
  findAll: jest.fn()
}

describe('getUnpublishedDelinked', () => {
  beforeEach(() => {
    db.delinkedCalculation.findAll.mockResolvedValue([mockTotal1, mockTotal2, mockTotal3])
  })

  test('getUnpublishedDelinked returns the correct data', async () => {
    const transaction = {}
    const result = await getUnpublishedDelinked(transaction)
    expect(result).toEqual([mockTotal1, mockTotal2, mockTotal3])

    expect(db.delinkedCalculation.findAll).toHaveBeenCalledWith({
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
      attributes: [
        'applicationId',
        ['calculationId', 'calculationReference'],
        'sbi',
        'frn',
        'paymentBand1',
        'paymentBand2',
        'paymentBand3',
        'paymentBand4',
        'percentageReduction1',
        'percentageReduction2',
        'percentageReduction3',
        'percentageReduction4',
        'progressiveReductions1',
        'progressiveReductions2',
        'progressiveReductions3',
        'progressiveReductions4',
        'referenceAmount',
        'totalProgressiveReduction',
        'totalDelinkedPayment',
        'paymentAmountCalculated',
        'datePublished',
        'updated'
      ],
      raw: true,
      transaction
    })
  })
})
