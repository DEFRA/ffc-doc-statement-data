const { loadOrganisations } = require('../../../../app/etl/load-scripts/load-organisations')

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
  })

  test('should call executeQuery with correct parameters when day0DateTime is not set', async () => {
    const startDate = new Date('2023-01-01')

    const { executeQuery } = require('../../../../app/etl/load-scripts/load-interm-utils')
    executeQuery.mockResolvedValueOnce()

    await loadOrganisations(startDate, mockTransaction)

    expect(executeQuery).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO public.organisations'), {
      startDate
    }, mockTransaction)
  })
})
