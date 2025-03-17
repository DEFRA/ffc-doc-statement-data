const db = require('../../../app/data')
const getUnpublishedDax = require('../../../app/publishing/dax/get-unpublished')
const { mockDax1, mockDax2, mockDax3 } = require('../../mocks/dax')

db.dax = {
  findAll: jest.fn()
}

describe('send dax updates', () => {
  beforeEach(async () => {
    db.dax.findAll.mockResolvedValue([mockDax1, mockDax2, mockDax3])
  })

  test('getUnpublishedDax returns the correct data', async () => {
    const transaction = {}
    const result = await getUnpublishedDax(transaction)

    expect(result).toEqual([mockDax1, mockDax2, mockDax3])
  })
})
