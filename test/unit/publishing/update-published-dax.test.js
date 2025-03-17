const db = require('../../../app/data')
const updateDaxDatePublished = require('../../../app/publishing/dax/update-published')
const mockDax = { paymentReference: 'test', datePublished: null }

db.dax = {
  update: jest.fn()
}

describe('updateDaxDatePublished', () => {
  beforeEach(() => {
    db.dax.update.mockResolvedValue([1])
  })

  test('updateDaxDatePublished updates the correct data', async () => {
    const transaction = {}
    await updateDaxDatePublished(mockDax.paymentReference, transaction)
    expect(db.dax.update).toHaveBeenCalledWith(
      { datePublished: expect.any(Date) },
      { where: { paymentReference: mockDax.paymentReference }, transaction }
    )
  })
})
