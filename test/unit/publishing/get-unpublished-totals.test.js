// Import the necessary modules and the function to be tested
const db = require('../../../app/data')
const getUnpublishedTotals = require('../../../app/publishing/totals_/get-unpublished-totals')
const { mockTotal1, mockTotal2, mockTotal3 } = require('../../mocks/totals')

// Mock the necessary methods and models
db.total = {
  findAll: jest.fn()
}

describe('getUnpublishedTotals', () => {
  beforeEach(() => {
    // Mock the findAll method
    db.total.findAll.mockResolvedValue([mockTotal1, mockTotal2, mockTotal3])
  })

  test('getUnpublishedTotals returns the correct data', async () => {
    const transaction = {} // This is sufficient for your test
    const result = await getUnpublishedTotals(transaction)

    // Check if the result is correct
    expect(result).toEqual([mockTotal1, mockTotal2, mockTotal3])

    // Check if the findAll method was called with the correct arguments
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
      attributes: ['calculationId', 'sbi', 'frn', 'calculationDate', 'invoiceNumber', 'schemeType', 'updated', 'datePublished'],
      raw: true,
      transaction
    })
  })
})
