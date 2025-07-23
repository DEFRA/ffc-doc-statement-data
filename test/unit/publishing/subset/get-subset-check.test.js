const mockFindOne = jest.fn()

jest.mock('../../../../app/data', () => ({
  subsetCheck: { findOne: mockFindOne }
}))

const getSubsetCheck = require('../../../../app/publishing/subset/get-subset-check')

describe('getSubsetCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns subset checks for given scheme', async () => {
    const mockResult = { id: 1, scheme: 'A' }
    mockFindOne.mockResolvedValue(mockResult)
    const result = await getSubsetCheck('A')
    expect(mockFindOne).toHaveBeenCalledWith({
      lock: true,
      skipLocked: true,
      raw: true,
      where: { scheme: 'A' }
    })
    expect(result).toEqual(mockResult)
  })

  test('returns empty array if no results', async () => {
    mockFindOne.mockResolvedValue([])
    const result = await getSubsetCheck('B')
    expect(result).toEqual([])
  })
})
