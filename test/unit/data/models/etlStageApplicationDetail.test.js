const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageApplicationDetail')

describe('etlStageApplicationDetail Model', () => {
  let etlStageApplicationDetail

  beforeAll(() => {
    etlStageApplicationDetail = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageApplicationDetail.getTableName()).toBe('etlStageApplicationDetail')
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

    expect(attributes.dtInsert).toBeDefined()
    expect(attributes.dtInsert.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.dtDelete).toBeDefined()
    expect(attributes.dtDelete.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.subjectId).toBeDefined()
    expect(attributes.subjectId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.uteId).toBeDefined()
    expect(attributes.uteId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.applicationId).toBeDefined()
    expect(attributes.applicationId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.applicationCode).toBeDefined()
    expect(attributes.applicationCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.amendedAppId).toBeDefined()
    expect(attributes.amendedAppId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.appTypeId).toBeDefined()
    expect(attributes.appTypeId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.proxyId).toBeDefined()
    expect(attributes.proxyId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.statusPCode).toBeDefined()
    expect(attributes.statusPCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.statusSCode).toBeDefined()
    expect(attributes.statusSCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.sourcePCode).toBeDefined()
    expect(attributes.sourcePCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.sourceSCode).toBeDefined()
    expect(attributes.sourceSCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.dtStart).toBeDefined()
    expect(attributes.dtStart.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.dtEnd).toBeDefined()
    expect(attributes.dtEnd.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.validStartFlg).toBeDefined()
    expect(attributes.validStartFlg.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.validEndFlg).toBeDefined()
    expect(attributes.validEndFlg.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.appIdStart).toBeDefined()
    expect(attributes.appIdStart.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.appIdEnd).toBeDefined()
    expect(attributes.appIdEnd.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.dtRecUpdate).toBeDefined()
    expect(attributes.dtRecUpdate.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.userId).toBeDefined()
    expect(attributes.userId.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageApplicationDetail.options.tableName).toBe('etlStageApplicationDetail')
    expect(etlStageApplicationDetail.options.freezeTableName).toBe(true)
    expect(etlStageApplicationDetail.options.timestamps).toBe(false)
  })
})
