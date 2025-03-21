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

    expect(attributes.organisationName).toBeDefined()
    expect(attributes.organisationName.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.confirmedFlg).toBeDefined()
    expect(attributes.confirmedFlg.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.landConfirmedFlg).toBeDefined()
    expect(attributes.landConfirmedFlg.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.sbi).toBeDefined()
    expect(attributes.sbi.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.taxRegistrationNumber).toBeDefined()
    expect(attributes.taxRegistrationNumber.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.legalStatusTypeId).toBeDefined()
    expect(attributes.legalStatusTypeId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.businessReference).toBeDefined()
    expect(attributes.businessReference.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.businessTypeId).toBeDefined()
    expect(attributes.businessTypeId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.vendorNumber).toBeDefined()
    expect(attributes.vendorNumber.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.landDetailsConfirmedDtKey).toBeDefined()
    expect(attributes.landDetailsConfirmedDtKey.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.businessDetConfirmedDtKey).toBeDefined()
    expect(attributes.businessDetConfirmedDtKey.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.registrationDate).toBeDefined()
    expect(attributes.registrationDate.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.charityCommissionRegnum).toBeDefined()
    expect(attributes.charityCommissionRegnum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.companiesHouseRegnum).toBeDefined()
    expect(attributes.companiesHouseRegnum.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.additionalBusinesses).toBeDefined()
    expect(attributes.additionalBusinesses.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.amended).toBeDefined()
    expect(attributes.amended.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.traderNumber).toBeDefined()
    expect(attributes.traderNumber.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.dateStartedFarming).toBeDefined()
    expect(attributes.dateStartedFarming.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.accountablePeopleCompleted).toBeDefined()
    expect(attributes.accountablePeopleCompleted.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.financialToBusinessAddr).toBeDefined()
    expect(attributes.financialToBusinessAddr.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.corrAsBusinessAddr).toBeDefined()
    expect(attributes.corrAsBusinessAddr.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.lastUpdatedOn).toBeDefined()
    expect(attributes.lastUpdatedOn.type.key).toBe(DataTypes.DATE.key)
  })

  test('should have correct options', () => {
    expect(etlStageOrganisation.options.tableName).toBe('etlStageOrganisation')
    expect(etlStageOrganisation.options.freezeTableName).toBe(true)
    expect(etlStageOrganisation.options.timestamps).toBe(false)
  })
})
