const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageCssContractApplications')

describe('etlStageCssContractApplications Model', () => {
  let etlStageCssContractApplications

  beforeAll(() => {
    etlStageCssContractApplications = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageCssContractApplications.getTableName().name).toBe('etlStageCssContractApplications')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageCssContractApplications.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.cssContractApplicationWid).toBeDefined()
    expect(attributes.cssContractApplicationWid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.pkid).toBeDefined()
    expect(attributes.pkid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.contractId).toBeDefined()
    expect(attributes.contractId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.applicationId).toBeDefined()
    expect(attributes.applicationId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.dataSourceSCode).toBeDefined()
    expect(attributes.dataSourceSCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.startDt).toBeDefined()
    expect(attributes.startDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.endDt).toBeDefined()
    expect(attributes.endDt.type.key).toBe(DataTypes.DATE.key)
  })

  test('should have correct options', () => {
    expect(etlStageCssContractApplications.options.tableName).toBe('etlStageCssContractApplications')
    expect(etlStageCssContractApplications.options.freezeTableName).toBe(true)
    expect(etlStageCssContractApplications.options.timestamps).toBe(false)
  })
})
