// Import the necessary modules and the function to be tested
const db = require('../../../app/data')
const getUnpublishedDax = require('../../../app/publishing/dax_/get-unpublished')
const { mockDax1, mockDax2, mockDax3 } = require('../../mocks/dax')

// Mock the necessary methods and models
db.dax = {
  findAll: jest.fn()
}

describe('send dax updates', () => {
  beforeEach(async () => {
    // Mock the findAll method
    db.dax.findAll.mockResolvedValue([mockDax1, mockDax2, mockDax3])
  })

  test('getUnpublishedDax returns the correct data', async () => {
    const transaction = {} // This is sufficient for your test
    const result = await getUnpublishedDax(transaction)
    // Check if the result is correct
    expect(result).toEqual([mockDax1, mockDax2, mockDax3])
  })
})
