// Import the necessary modules and the function to be tested
const db = require('../../../app/data')
const updateDaxDatePublished = require('../../../app/publishing/dax_/update-published')
const mockDax = { paymentReference: 'test', datePublished: null }

// Mock the necessary methods and models
db.dax = {
  update: jest.fn()
}

describe('updateDaxDatePublished', () => {
  beforeEach(() => {
    // Mock the update method
    db.dax.update.mockResolvedValue([1]) // Assume 1 row is updated
  })

  test('updateDaxDatePublished updates the correct data', async () => {
    const transaction = {} // This is sufficient for your test
    await updateDaxDatePublished(mockDax.paymentReference, transaction)

    // Check if the update method was called with the correct arguments
    expect(db.dax.update).toHaveBeenCalledWith(
      { datePublished: expect.any(Date) },
      { where: { paymentReference: mockDax.paymentReference }, transaction }
    )
  })
})
