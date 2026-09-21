const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getUnpublishedD365 = require('../../../../app/publishing/d365/get-unpublished')
const { mockD3651, mockD3652, mockD3653 } = require('../../../mocks/d365')

describe('send d365 updates', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves([mockD3651, mockD3652, mockD3653])
  })

  test('getUnpublishedD365 returns the correct data', async () => {
    const transaction = mockDb.trx
    const result = await getUnpublishedD365(transaction)

    expect(result).toEqual([mockD3651, mockD3652, mockD3653])
    expect(mockDb.tables.d365).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereNull).toHaveBeenCalledWith('datePublished')
    expect(mockDb.builder.limit).toHaveBeenCalledWith(expect.any(Number))
    expect(mockDb.builder.forUpdate).toHaveBeenCalled()
    expect(mockDb.builder.skipLocked).toHaveBeenCalled()
    expect(mockDb.builder.orderByRaw).not.toHaveBeenCalled()
  })

  test('getUnpublishedD365 sets random order when randomise is true', async () => {
    const transaction = mockDb.trx
    await getUnpublishedD365(transaction, undefined, true)

    expect(mockDb.builder.orderByRaw).toHaveBeenCalledWith('random()')
  })
})
