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

    expect(db.total.findAll).toMatchSnapshot()
  })
})
