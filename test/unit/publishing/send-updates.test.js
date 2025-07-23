const { publishingConfig } = require('../../../app/config')
const getSubsetCheck = require('../../../app/publishing/subset/get-subset-check')
const defaultPublishingPerType = require('../../../app/publishing/default-publishing-per-type')
const sendDelinkedSubset = require('../../../app/publishing/subset/send-delinked-subset')
const sendUpdates = require('../../../app/publishing/send-updates')
const { DELINKED, SFI23 } = require('../../../app/constants/schemes')

jest.mock('../../../app/config', () => ({
  publishingConfig: {
    publishingEnabled: true,
    delinked: { subsetProcess: false },
    sfi23: { subsetProcess: false }
  },
  dbConfig: {
    test: {
      database: 'mockdb',
      username: 'mockuser',
      password: 'mockpass',
      schema: 'public'
    }
  },
  env: 'test'
}))

jest.mock('../../../app/data', () => ({
  subsetCheck: {
    findAll: jest.fn()
  }
}))

jest.mock('../../../app/publishing/subset/get-subset-check')
jest.mock('../../../app/publishing/default-publishing-per-type')
jest.mock('../../../app/publishing/subset/send-delinked-subset')

describe('sendUpdates', () => {
  let logSpy

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.clearAllMocks()
    publishingConfig.publishingEnabled = true
    publishingConfig.delinked.subsetProcess = false
    publishingConfig.sfi23.subsetProcess = false
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  test.each([DELINKED, SFI23])('does not proceed if publishing is disabled for %s', async (scheme) => {
    publishingConfig.publishingEnabled = false
    await sendUpdates(scheme)
    expect(logSpy).toHaveBeenCalledWith('Publishing is disabled via publishingEnabled=false flag')
    expect(getSubsetCheck).not.toHaveBeenCalled()
  })

  test.each([DELINKED, SFI23])('logs error and returns if getSubsetCheck returns null for %s', async (scheme) => {
    publishingConfig[scheme].subsetProcess = true
    getSubsetCheck.mockResolvedValue(null)
    await sendUpdates(scheme)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Error occurred determining'))
    expect(defaultPublishingPerType).not.toHaveBeenCalled()
    expect(sendDelinkedSubset).not.toHaveBeenCalled()
  })

  test.each([DELINKED, SFI23])('logs skip and returns if subsetSent is true for %s', async (scheme) => {
    publishingConfig[scheme].subsetProcess = true
    getSubsetCheck.mockResolvedValue({ subsetSent: true })
    await sendUpdates(scheme)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Skipping'))
    expect(defaultPublishingPerType).not.toHaveBeenCalled()
    expect(sendDelinkedSubset).not.toHaveBeenCalled()
  })

  test.each([DELINKED])('logs processing and proceeds if subsetSent is false for %s', async (scheme) => {
    publishingConfig[scheme].subsetProcess = true
    getSubsetCheck.mockResolvedValue({ subsetSent: false })
    if (scheme === DELINKED) {
      await sendUpdates(scheme)
      expect(sendDelinkedSubset).toHaveBeenCalled()
    } else {
      await sendUpdates(scheme)
      expect(defaultPublishingPerType).not.toHaveBeenCalled()
    }
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Processing'))
  })

  test.each([DELINKED, SFI23])('logs normal processing if subsetProcess is false for %s', async (scheme) => {
    publishingConfig[scheme].subsetProcess = false
    await sendUpdates(scheme)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Processing'))
    expect(defaultPublishingPerType).toHaveBeenCalled()
  })

  test('calls sendDelinkedSubset for DELINKED with subsetProcess true', async () => {
    publishingConfig.delinked.subsetProcess = true
    getSubsetCheck.mockResolvedValue({ subsetSent: false })
    await sendUpdates(DELINKED)
    expect(sendDelinkedSubset).toHaveBeenCalled()
    expect(defaultPublishingPerType).not.toHaveBeenCalled()
  })

  test('calls defaultPublishingPerType with correct types for DELINKED', async () => {
    publishingConfig.delinked.subsetProcess = false
    publishingConfig.sfi23.subsetProcess = false
    await sendUpdates(DELINKED)
    expect(defaultPublishingPerType).toHaveBeenCalledTimes(3)
    expect(defaultPublishingPerType.mock.calls[0][0]).toBeDefined()
  })

  test('calls defaultPublishingPerType with correct types for SFI23', async () => {
    publishingConfig.delinked.subsetProcess = false
    publishingConfig.sfi23.subsetProcess = false
    await sendUpdates(SFI23)
    expect(defaultPublishingPerType).toHaveBeenCalledTimes(4)
    expect(defaultPublishingPerType.mock.calls[0][0]).toBeDefined()
  })

  test('logs subset process in operation if non-scheme subsetProcess is true', async () => {
    publishingConfig.delinked.subsetProcess = true
    publishingConfig.sfi23.subsetProcess = false
    await sendUpdates(SFI23)
    expect(logSpy).toHaveBeenCalledWith(`A subset process is in operation, normal processing not completed for ${SFI23}`)
  })
})
