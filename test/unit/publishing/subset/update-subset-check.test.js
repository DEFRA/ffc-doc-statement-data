const mockUpdate = jest.fn()

jest.mock('../../../../app/data', () => ({
  subsetCheck: { update: mockUpdate }
}))

const { DELINKED } = require('../../../../app/constants/schemes')
const updateSubsetCheck = require('../../../../app/publishing/subset/update-subset-check')

describe('updateSubsetCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('updates subsetSent to true by default', async () => {
    mockUpdate.mockResolvedValue([1])
    const result = await updateSubsetCheck(DELINKED)
    expect(mockUpdate).toHaveBeenCalledWith(
      { subsetSent: true },
      { where: { scheme: DELINKED } }
    )
    expect(result).toEqual([1])
  })

  test('updates subsetSent to false if specified', async () => {
    mockUpdate.mockResolvedValue([1])
    const result = await updateSubsetCheck(DELINKED, false)
    expect(mockUpdate).toHaveBeenCalledWith(
      { subsetSent: false },
      { where: { scheme: DELINKED } }
    )
    expect(result).toEqual([1])
  })
})
