const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageApplicationDetail')

describe('etlStageApplicationDetail Model', () => {
  let etlStageApplicationDetail

  beforeAll(() => {
    etlStageApplicationDetail = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageApplicationDetail.getTableName().name).toBe('etlStageApplicationDetail')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageApplicationDetail.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.pkid).toBeDefined()
    expect(attributes.pkid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.applicationId).toBeDefined()
    expect(attributes.applicationId.type.key).toBe(DataTypes.INTEGER.key)
  })

  test('should have correct options', () => {
    expect(etlStageApplicationDetail.options.tableName).toBe('etlStageApplicationDetail')
    expect(etlStageApplicationDetail.options.freezeTableName).toBe(true)
    expect(etlStageApplicationDetail.options.timestamps).toBe(false)
  })
})
