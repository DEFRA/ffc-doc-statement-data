const db = require('../../../app/data')
const getUnpublishedD365 = require('../../../app/publishing/d365/get-unpublished')
const { mockD3651, mockD3652, mockD3653 } = require('../../mocks/d365')

db.d365 = {
  findAll: jest.fn()
}

describe('send d365 updates', () => {
  beforeEach(async () => {
    db.d365.findAll.mockClear()
    db.d365.findAll.mockResolvedValue([mockD3651, mockD3652, mockD3653])
  })

  test('getUnpublishedD365 returns the correct data', async () => {
    const transaction = {}
    const result = await getUnpublishedD365(transaction)
    expect(result).toEqual([mockD3651, mockD3652, mockD3653])
    expect(db.d365.findAll).toHaveBeenCalledWith(expect.objectContaining({
      lock: true,
      skipLocked: true,
      where: { datePublished: null },
      transaction,
      limit: expect.any(Number)
    }))
    expect(db.d365.findAll.mock.calls[0][0].order).toBeUndefined()
  })

  test('getUnpublishedD365 sets random order when randomise is true', async () => {
    const transaction = {}
    await getUnpublishedD365(transaction, undefined, true)
    expect(db.d365.findAll).toHaveBeenCalledWith(expect.objectContaining({
      order: expect.any(Object)
    }))
  })
})
