const db = require('../../../../app/data')
const updateD365DatePublished = require('../../../../app/publishing/d365/update-published')
const mockD365 = { paymentReference: 'test', datePublished: null }

db.d365 = {
  update: jest.fn()
}

describe('updateD365DatePublished', () => {
  beforeEach(() => {
    db.d365.update.mockResolvedValue([1])
  })

  test('updateD365DatePublished updates the correct data', async () => {
    const transaction = {}
    await updateD365DatePublished(mockD365.paymentReference, transaction)
    expect(db.d365.update).toHaveBeenCalledWith(
      { datePublished: expect.any(Date) },
      { where: { d365Id: mockD365.paymentReference }, transaction }
    )
  })
})
