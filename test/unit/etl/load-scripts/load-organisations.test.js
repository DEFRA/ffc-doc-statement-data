jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

jest.mock('../../../../app/etl/load-scripts/load-interm-utils')
jest.mock('../../../../app/config/message', () => ({
  day0DateTime: null
}))

describe('loadOrganisations', () => {
  let mockTransaction

  beforeEach(() => {
    mockTransaction = {}
    jest.resetModules()
  })

  test('should call executeQuery with DO UPDATE ON CONFLICT clause when day0DateTime is not set', async () => {
    jest.doMock('../../../../app/config/message', () => ({
      day0DateTime: null
    }))

    const { executeQuery } = require('../../../../app/etl/load-scripts/load-interm-utils')
    executeQuery.mockResolvedValueOnce()

    const { loadOrganisations } = require('../../../../app/etl/load-scripts/load-organisations')

    const startDate = new Date('2023-01-01')

    await loadOrganisations(startDate, mockTransaction)

    expect(executeQuery).toHaveBeenCalledTimes(1)
    expect(executeQuery).toHaveBeenCalledWith(
      expect.stringContaining('ON CONFLICT (sbi) DO UPDATE SET'),
      { startDate },
      mockTransaction
    )
  })

  test('should call executeQuery with DO NOTHING ON CONFLICT clause when day0DateTime is set', async () => {
    jest.doMock('../../../../app/config/message', () => ({
      day0DateTime: '2023-01-01T00:00:00Z'
    }))

    const { executeQuery } = require('../../../../app/etl/load-scripts/load-interm-utils')
    executeQuery.mockResolvedValueOnce()

    const { loadOrganisations } = require('../../../../app/etl/load-scripts/load-organisations')

    const startDate = new Date('2023-01-01')

    await loadOrganisations(startDate, mockTransaction)

    expect(executeQuery).toHaveBeenCalledTimes(1)
    expect(executeQuery).toHaveBeenCalledWith(
      expect.stringContaining('ON CONFLICT (sbi) DO NOTHING'),
      { startDate },
      mockTransaction
    )
  })
})
