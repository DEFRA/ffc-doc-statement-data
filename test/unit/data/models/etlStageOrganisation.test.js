const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageOrganisation')

describe('etlStageOrganisation Model', () => {
  let etlStageOrganisation

  beforeAll(() => {
    etlStageOrganisation = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageOrganisation.getTableName().name).toBe('etlStageOrganisation')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageOrganisation.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.organisationWid).toBeDefined()
    expect(attributes.organisationWid.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.partyId).toBeDefined()
    expect(attributes.partyId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.sbi).toBeDefined()
    expect(attributes.sbi.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.lastUpdatedOn).toBeDefined()
    expect(attributes.lastUpdatedOn.type.key).toBe(DataTypes.DATE.key)
  })

  test('should have correct options', () => {
    expect(etlStageOrganisation.options.tableName).toBe('etlStageOrganisation')
    expect(etlStageOrganisation.options.freezeTableName).toBe(true)
    expect(etlStageOrganisation.options.timestamps).toBe(false)
  })
})
