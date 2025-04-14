const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageDefraLinks')

describe('etlStageDefraLinks Model', () => {
  let etlStageDefraLinks

  beforeAll(() => {
    etlStageDefraLinks = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageDefraLinks.getTableName().name).toBe('etlStageDefraLinks')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageDefraLinks.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.defraLinksWid).toBeDefined()
    expect(attributes.defraLinksWid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.subjectId).toBeDefined()
    expect(attributes.subjectId.type.key).toBe(DataTypes.INTEGER.key)
  })

  test('should have correct options', () => {
    expect(etlStageDefraLinks.options.tableName).toBe('etlStageDefraLinks')
    expect(etlStageDefraLinks.options.freezeTableName).toBe(true)
    expect(etlStageDefraLinks.options.timestamps).toBe(false)
  })
})
