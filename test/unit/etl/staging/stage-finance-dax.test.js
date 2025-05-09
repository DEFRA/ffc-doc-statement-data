const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { stageFinanceDAX } = require('../../../../app/etl/staging/stage-finance-dax')
const { Readable } = require('stream')

jest.mock('uuid')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/config/etl')
jest.mock('../../../../app/constants/tables')
jest.mock('../../../../app/etl/run-etl-process')

describe('stageFinanceDAX', () => {
  let runEtlProcess

  beforeAll(() => {
    runEtlProcess = require('../../../../app/etl/run-etl-process').runEtlProcess
    jest.spyOn(require('../../../../app/etl/run-etl-process'), 'runEtlProcess').mockResolvedValue()
  })

  test('should download the file and run the ETL process', async () => {
    const mockFile = 'Finance_Dax_SFI23/export.csv'
    const mockUuid = 'mock-uuid'

    uuidv4.mockReturnValue(mockUuid)
    const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
    const mockReadableStream = Readable.from(mockStreamData.split('\n'))
    storage.downloadFileAsStream = jest.fn().mockResolvedValue(mockReadableStream)

    await stageFinanceDAX()

    expect(storage.downloadFileAsStream).toHaveBeenCalledWith(mockFile)
    expect(runEtlProcess).toMatchSnapshot()
  })
})
