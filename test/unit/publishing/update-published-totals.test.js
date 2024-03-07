// Import the necessary modules and the function to be tested
const db = require('../../../app/data')
const updatePublished = require('../../../app/publishing/totals_/update-published')

// Mock the necessary methods and models
db.total = {
  update: jest.fn()
}

describe('updatePublished', () => {
  beforeEach(() => {
    // Mock the update method
    db.total.update.mockResolvedValue()
  })

  test('updatePublished updates the correct data', async () => {
    const transaction = {} // This is sufficient for your test
    const calculationId = 1234567 // Replace with an actual calculationId
    await updatePublished(calculationId, transaction)

    // Check if the update method was called with the correct arguments
    expect(db.total.update).toHaveBeenCalledWith(
      { datePublished: expect.any(Date) },
      { where: { calculationId }, transaction }
    )
  })
})
