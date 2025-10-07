const db = require('../../../../app/data')
const { loadIntermOrgFromDay0 } = require('../../../../app/etl/load-scripts')
const { getEtlStageLogs } = require('../../../../app/etl/load-scripts/load-interm-utils')

jest.mock('../../../../app/data')
jest.mock('../../../../app/etl/load-scripts/load-interm-utils')

describe('loadIntermOrgFromDay0', () => {
  const startDate = new Date()
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return false if no ETL stage logs are found', async () => {
    getEtlStageLogs.mockResolvedValue([])

    const result = await loadIntermOrgFromDay0(startDate, transaction)

    expect(result).toBe(false)
    expect(getEtlStageLogs).toHaveBeenCalledWith(startDate, expect.any(Array))
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should execute the query if ETL stage logs are found', async () => {
    getEtlStageLogs.mockResolvedValue([{ id: 1 }])

    const queryResponse = {}
    db.sequelize.query.mockResolvedValue(queryResponse)

    const result = await loadIntermOrgFromDay0(startDate, transaction)

    expect(result).toBe(true)
    expect(getEtlStageLogs).toHaveBeenCalledWith(startDate, expect.any(Array))
    expect(db.sequelize.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO'), {
      raw: true,
      transaction
    })
  })

  test('should log a message after loading data', async () => {
    getEtlStageLogs.mockResolvedValue([{ id: 1 }])
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    await loadIntermOrgFromDay0(startDate, transaction)

    expect(consoleSpy).toHaveBeenCalledWith('Loaded intermediate data for Day 0 Organisations')
    consoleSpy.mockRestore()
  })
})
