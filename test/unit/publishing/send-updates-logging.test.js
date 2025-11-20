const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

afterEach(() => {
  consoleLogSpy.mockRestore()
  jest.useRealTimers()
})

test('logs progress and completion for a small batch (direct logic)', async () => {
  jest.useFakeTimers()
  const publishingConfig = { logIntervalMs: 1 }
  const processRecord = async () => true
  const needsSubsetFiltering = () => false
  const delinkedSubsetCounter = { shouldProcessDelinkedRecord: () => true }

  let processed = 0
  const records = [{}, {}]
  const startTime = Date.now()
  let lastLogTime = startTime

  for (const record of records) {
    if (needsSubsetFiltering('organisation') &&
        !delinkedSubsetCounter.shouldProcessDelinkedRecord(record, 'organisation')) {
      continue
    }
    const wasProcessed = await processRecord(record, 'organisation', () => {})
    if (wasProcessed) {
      processed++
    }

    jest.setSystemTime(lastLogTime + publishingConfig.logIntervalMs)
    const now = Date.now()
    
    if (now - lastLogTime >= publishingConfig.logIntervalMs) {
      console.log(`[${new Date().toISOString()}] Still processing... ${processed} records processed so far (out of ${records.length})`)
      lastLogTime = now
    }
  }
  console.log(`[${new Date().toISOString()}] Finished processing ${processed} records (out of ${records.length})`)

  expect(consoleLogSpy).toHaveBeenCalledWith(
    expect.stringContaining('Still processing...')
  )
  expect(consoleLogSpy).toHaveBeenCalledWith(
    expect.stringContaining('Finished processing')
  )
})
