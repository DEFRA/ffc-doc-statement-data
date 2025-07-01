const mockFindAll = jest.fn()
const mockCol = jest.fn((col) => `col:${col}`)
const mockOp = {
  and: 'AND',
  or: 'OR',
  in: 'IN',
  lt: 'LT'
}

jest.mock('../../../../app/data', () => ({
  organisation: { findAll: mockFindAll },
  Sequelize: { Op: mockOp },
  sequelize: { col: mockCol }
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
    mockFindAll.mockResolvedValue(mockResult)

    const result = await getSubsetOrganisations([123])
    expect(mockFindAll).toHaveBeenCalledWith(expect.objectContaining({
      lock: true,
      skipLocked: true,
      where: expect.any(Object),
      attributes: expect.arrayContaining([
        'sbi', 'addressLine1', 'addressLine2', 'addressLine3', 'city', 'county', 'postcode', 'emailAddress', 'frn', 'name', 'updated'
      ]),
      raw: true
    }))
    expect(result).toEqual(mockResult)
  })

  test('returns empty array if no organisations found', async () => {
    mockFindAll.mockResolvedValue([])
    const result = await getSubsetOrganisations([999])
    expect(result).toEqual([])
  })

  test('passes correct where clause with sbiArray', async () => {
    mockFindAll.mockResolvedValue([])
    const sbiArray = [1, 2, 3]
    await getSubsetOrganisations(sbiArray)
    const callArgs = mockFindAll.mock.calls[0][0]
    expect(callArgs.where[mockOp.and][0]).toEqual({
      sbi: { [mockOp.in]: sbiArray }
    })
    expect(callArgs.where[mockOp.and][1][mockOp.or][1].published).toEqual({ [mockOp.lt]: 'col:updated' })
  })
})