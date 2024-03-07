const getUnpublished = require('../../../app/publishing/totals/get-unpublished')
const getUnpublishedTotals = require('../../../app/publishing/totals/get-unpublished-totals')
const getActionsByCalculationId = require('../../../app/publishing/totals/get-actions-by-calculation-id')
const { mockTotal1, mockTotal2, mockTotal3 } = require('../../mocks/totals')
const { mockAction1, mockAction2, mockAction3 } = require('../../mocks/actions')

jest.mock('../../../app/publishing/totals/get-unpublished-totals')
jest.mock('../../../app/publishing/totals/get-actions-by-calculation-id')

describe('getUnpublished', () => {
  beforeEach(() => {
    getUnpublishedTotals.mockResolvedValue([mockTotal1, mockTotal2, mockTotal3])
    getActionsByCalculationId.mockResolvedValue([mockAction1, mockAction2, mockAction3])
  })

  test('getUnpublished returns the correct data', async () => {
    const transaction = {}
    const result = await getUnpublished(transaction)

    expect(result).toEqual([
      { ...mockTotal1, actions: [mockAction1, mockAction2, mockAction3] },
      { ...mockTotal2, actions: [mockAction1, mockAction2, mockAction3] },
      { ...mockTotal3, actions: [mockAction1, mockAction2, mockAction3] }
    ])
  })
})
