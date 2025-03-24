const db = require('../../../../app/data')
const { getEtlStageLogs, executeQuery, limitConcurrency } = require('../../../../app/etl/load-scripts/load-interm-utils')

jest.mock('../../../../app/data')

describe('getEtlStageLogs', () => {
  test('should return logs for a single folder', async () => {
    const startDate = new Date('2023-01-01')
    const folder = 'folder1'
    const mockLogs = [{ id: 1, file: 'folder1/export.csv', endedAt: new Date('2023-01-02') }]

    db.etlStageLog.findAll.mockResolvedValue(mockLogs)

    const result = await getEtlStageLogs(startDate, folder)
    expect(result).toEqual(mockLogs)
  })

  test('should return logs for multiple folders', async () => {
    const startDate = new Date('2023-01-01')
    const folders = ['folder1', 'folder2']
    const mockLogs1 = [{ id: 1, file: 'folder1/export.csv', endedAt: new Date('2023-01-02') }]
    const mockLogs2 = [{ id: 2, file: 'folder2/export.csv', endedAt: new Date('2023-01-03') }]

    db.etlStageLog.findAll
      .mockResolvedValueOnce(mockLogs1)
      .mockResolvedValueOnce(mockLogs2)

    const result = await getEtlStageLogs(startDate, folders)
    expect(result).toEqual([...mockLogs1, ...mockLogs2])
  })

  test('should throw an error if multiple records are found for a folder', async () => {
    const startDate = new Date('2023-01-01')
    const folder = 'folder1'
    const mockLogs = [
      { id: 1, file: 'folder1/export.csv', endedAt: new Date('2023-01-02') },
      { id: 2, file: 'folder1/export.csv', endedAt: new Date('2023-01-03') }
    ]

    db.etlStageLog.findAll.mockResolvedValue(mockLogs)

    await expect(getEtlStageLogs(startDate, folder)).rejects.toThrow('Multiple records found for updates to folder1, expected only one')
  })

  test('should return an empty array if no logs are found', async () => {
    const startDate = new Date('2023-01-01')
    const folder = 'folder1'

    db.etlStageLog.findAll.mockResolvedValue([])

    const result = await getEtlStageLogs(startDate, folder)
    expect(result).toEqual([])
  })
})

describe('executeQuery', () => {
  test('should execute the query with the given replacements and transaction', async () => {
    const query = 'SELECT * FROM table WHERE id = :id'
    const replacements = { id: 1 }
    const transaction = {}

    db.sequelize.query.mockResolvedValue([[], {}])

    await executeQuery(query, replacements, transaction)
    expect(db.sequelize.query).toHaveBeenCalledWith(query, {
      replacements,
      raw: true,
      transaction
    })
  })
})

describe('limitConcurrency', () => {
  test('should limit the concurrency of promises', async () => {
    const promises = [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3)
    ]
    const maxConcurrent = 2

    const result = await limitConcurrency(promises, maxConcurrent)
    expect(result).toEqual([1, 2, 3])
  })
})
