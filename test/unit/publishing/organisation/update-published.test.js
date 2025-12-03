const db = require('../../../../app/data')
const updatePublished = require('../../../../app/publishing/organisation/update-published')

jest.mock('../../../../app/data')

describe('updatePublished', () => {
  let transaction

  beforeEach(() => {
    transaction = {}
    jest.clearAllMocks()
  })

  test('updates published when address exists', async () => {
    db.organisation.findOne.mockResolvedValue({
      sbi: 123,
      addressLine1: 'Farm Lane',
      addressLine2: null,
      addressLine3: null,
      city: 'York',
      county: null,
      postcode: 'YO1 1AA'
    })

    db.organisation.update.mockResolvedValue([1])

    await updatePublished(123, transaction)

    expect(db.organisation.update).toHaveBeenCalledWith(
      { published: expect.any(Date) },
      { where: { sbi: 123 }, transaction }
    )

    expect(db.organisation.destroy).not.toHaveBeenCalled()
  })

  test('deletes organisation when no address exists', async () => {
    db.organisation.findOne.mockResolvedValue({
      sbi: 456,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      city: null,
      county: null,
      postcode: null
    })

    db.organisation.destroy.mockResolvedValue(1)

    await updatePublished(456, transaction)

    expect(db.organisation.destroy).toHaveBeenCalledWith({
      where: { sbi: 456 },
      transaction
    })

    expect(db.organisation.update).not.toHaveBeenCalled()
  })

  test('throws error when organisation not found', async () => {
    db.organisation.findOne.mockResolvedValue(null)

    await expect(updatePublished(999, transaction))
      .rejects
      .toThrow('Organisation with SBI 999 not found')

    expect(db.organisation.destroy).not.toHaveBeenCalled()
    expect(db.organisation.update).not.toHaveBeenCalled()
  })
})
