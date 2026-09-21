const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['organisation'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getSubsetOrganisations = require('../../../../app/publishing/organisation/get-subset-organisations')

describe('getSubsetOrganisations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns organisations matching sbiArray', async () => {
    const mockResult = [
      {
        sbi: 123,
        addressLine1: 'A',
        addressLine2: 'B',
        addressLine3: 'C',
        city: 'X',
        county: 'Y',
        postcode: 'Z',
        emailAddress: 'test@example.com',
        frn: 456,
        name: 'Test Org',
        updated: '2024-01-01'
      }
    ]
    mockDb.builder.resolves(mockResult)

    const result = await getSubsetOrganisations([123])

    expect(mockDb.tables.organisation).toHaveBeenCalledWith()
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('sbi', [123])
    expect(mockDb.builder.select).toHaveBeenCalledWith(
      'sbi', 'addressLine1', 'addressLine2', 'addressLine3', 'city', 'county', 'postcode', 'emailAddress', 'frn', 'name', 'updated'
    )
    expect(result).toEqual(mockResult)
  })

  test('returns empty array if no organisations found', async () => {
    mockDb.builder.resolves([])
    const result = await getSubsetOrganisations([999])
    expect(result).toEqual([])
  })

  test('passes correct sbiArray to whereIn', async () => {
    mockDb.builder.resolves([])
    const sbiArray = [1, 2, 3]
    await getSubsetOrganisations(sbiArray)

    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('sbi', sbiArray)
  })
})
