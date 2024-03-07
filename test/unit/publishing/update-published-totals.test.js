const db = require('../../../app/data')
const updatePublished = require('../../../app/publishing/totals_/update-published')

db.total = {
  update: jest.fn()
}

describe('updatePublished', () => {
  beforeEach(() => {
    db.total.update.mockResolvedValue()
  })

  test('updatePublished updates the correct data', async () => {
    const transaction = {}
    const calculationId = 1234567
    await updatePublished(calculationId, transaction)

    expect(db.total.update).toHaveBeenCalledWith(
      { datePublished: expect.any(Date) },
      { where: { calculationId }, transaction }
    )
  })
})
