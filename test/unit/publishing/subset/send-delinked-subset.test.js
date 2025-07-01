const mockGetUnpublishedD365 = jest.fn()
const mockGetRandomDelinkedCalculation = jest.fn()
const mockGetRandomOrganisations = jest.fn()
const mockSendSubset = jest.fn()
const mockUpdateSubsetCheck = jest.fn()

jest.mock('../../../../app/publishing/d365/get-unpublished', () => mockGetUnpublishedD365)
jest.mock('../../../../app/publishing/delinkedCalculation/get-subset-delinked-calculation', () => mockGetRandomDelinkedCalculation)
jest.mock('../../../../app/publishing/organisation/get-subset-organisations', () => mockGetRandomOrganisations)
jest.mock('../../../../app/publishing/subset/send-subset', () => mockSendSubset)
jest.mock('../../../../app/publishing/subset/update-subset-check', () => mockUpdateSubsetCheck)

const { DELINKED } = require('../../../../app/constants/schemes')
const { ORGANISATION, DELINKED_CALCULATION, D365 } = require('../../../../app/constants/types')

jest.mock('../../../../app/config', () => ({
  publishingConfig: {
    delinked: { processSubsetAmount: 5 }
  }
}))

const sendDelinkedSubset = require('../../../../app/publishing/subset/send-delinked-subset')

describe('sendDelinkedSubset', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('does nothing if no unpublished D365 records', async () => {
    mockGetUnpublishedD365.mockResolvedValue([])
    await sendDelinkedSubset()
    expect(mockGetUnpublishedD365).toHaveBeenCalled()
    expect(mockGetRandomDelinkedCalculation).not.toHaveBeenCalled()
    expect(mockGetRandomOrganisations).not.toHaveBeenCalled()
    expect(mockSendSubset).not.toHaveBeenCalled()
    expect(mockUpdateSubsetCheck).not.toHaveBeenCalled()
  })

  test('publishes subset when unpublished D365 records exist', async () => {
    const d365Records = [
      { calculationReference: 1, sbi: 10 },
      { calculationReference: 2, sbi: 20 }
    ]
    const delinkedCalculations = [
      { calculationReference: 1, sbi: 10 },
      { calculationReference: 2, sbi: 20 }
    ]
    const orgs = [
      { sbi: 10, name: 'Org1' },
      { sbi: 20, name: 'Org2' }
    ]
    mockGetUnpublishedD365.mockResolvedValue(d365Records)
    mockGetRandomDelinkedCalculation.mockResolvedValue(delinkedCalculations)
    mockGetRandomOrganisations.mockResolvedValue(orgs)

    await sendDelinkedSubset()

    expect(mockGetUnpublishedD365).toHaveBeenCalledWith(null, 5, true)
    expect(mockGetRandomDelinkedCalculation).toHaveBeenCalledWith([1, 2])
    expect(mockGetRandomOrganisations).toHaveBeenCalledWith([10, 20])
    expect(mockSendSubset).toHaveBeenCalledWith([
      { type: ORGANISATION, dataToPublish: orgs },
      { type: DELINKED_CALCULATION, dataToPublish: delinkedCalculations },
      { type: D365, dataToPublish: d365Records }
    ])
    expect(mockUpdateSubsetCheck).toHaveBeenCalledWith(DELINKED, true)
  })
})
