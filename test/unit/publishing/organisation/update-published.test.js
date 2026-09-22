const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['organisation'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const updatePublished = require('../../../../app/publishing/organisation/update-published')

describe('updatePublished', () => {
  let transaction

  beforeEach(() => {
    jest.clearAllMocks()
    transaction = mockDb.trx
  })

  test('updates published when address exists', async () => {
    mockDb.builder.resolves({
      sbi: 123,
      addressLine1: 'Farm Lane',
      addressLine2: null,
      addressLine3: null,
      city: 'York',
      county: null,
      postcode: 'YO1 1AA'
    })

    await updatePublished(123, transaction)

    expect(mockDb.builder.where).toHaveBeenCalledWith({ sbi: 123 })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ published: expect.any(Date) })
    expect(mockDb.builder.del).not.toHaveBeenCalled()
  })

  test('deletes organisation when no address exists', async () => {
    mockDb.builder.resolves({
      sbi: 456,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      city: null,
      county: null,
      postcode: null
    })

    await updatePublished(456, transaction)

    expect(mockDb.builder.where).toHaveBeenCalledWith({ sbi: 456 })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.update).not.toHaveBeenCalled()
  })

  test('throws error when organisation not found', async () => {
    mockDb.builder.resolves(undefined)

    await expect(updatePublished(999, transaction))
      .rejects
      .toThrow('Organisation with SBI 999 not found')

    expect(mockDb.builder.del).not.toHaveBeenCalled()
    expect(mockDb.builder.update).not.toHaveBeenCalled()
  })
})
