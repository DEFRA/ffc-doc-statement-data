const db = require('../../../../app/data')
const updatePublished = require('../../../../app/publishing/delinkedCalculation/update-published')

db.delinkedCalculation = {
  update: jest.fn()
}

describe('updatePublished', () => {
  beforeEach(() => {
    db.delinkedCalculation.update.mockResolvedValue()
  })

  test('updatePublished updates the correct data', async () => {
    const transaction = {}
    const calculationReference = 1234567
    await updatePublished(calculationReference, transaction)

    expect(db.delinkedCalculation.update).toHaveBeenCalledWith(
      { datePublished: expect.any(Date) },
      { where: { calculationId: calculationReference }, transaction }
    )
  })
})
