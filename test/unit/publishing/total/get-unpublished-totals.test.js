const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['total'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { publishingConfig } = require('../../../../app/config')
const getUnpublishedTotals = require('../../../../app/publishing/total/get-unpublished-total')
const { mockTotal1, mockTotal2, mockTotal3 } = require('../../../mocks/totals')

describe('getUnpublishedTotals', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves([mockTotal1, mockTotal2, mockTotal3])
  })

  test('getUnpublishedTotals passes transaction and limit to the total accessor', async () => {
    const transaction = mockDb.trx
    const limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource
    await getUnpublishedTotals(transaction, limit)

    expect(mockDb.tables.total).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereNull).toHaveBeenCalledWith('datePublished')
    expect(mockDb.builder.orWhereRaw).toHaveBeenCalledWith('"datePublished" < "updated"')
    expect(mockDb.builder.limit).toHaveBeenCalledWith(limit)
    expect(mockDb.builder.forUpdate).toHaveBeenCalled()
    expect(mockDb.builder.skipLocked).toHaveBeenCalled()
    expect(mockDb.builder.select).toHaveBeenCalledWith(
      'calculationId',
      { calculationReference: 'calculationId' },
      { totalsId: 'calculationId' },
      'sbi',
      'frn',
      'agreementNumber',
      'claimId',
      { claimReference: 'claimId' },
      'schemeType',
      'calculationDate',
      'invoiceNumber',
      'agreementStart',
      'agreementEnd',
      'totalAdditionalPayments',
      'totalActionPayments',
      'totalPayments',
      'updated',
      'datePublished'
    )
  })

  test('getUnpublishedTotals returns the correct data', async () => {
    const transaction = mockDb.trx
    const limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource
    const result = await getUnpublishedTotals(transaction, limit)
    expect(result).toEqual([mockTotal1, mockTotal2, mockTotal3])
  })
})
