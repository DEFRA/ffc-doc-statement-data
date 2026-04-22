const { removeAgreementData } = require('../../../app/retention')
const db = require('../../../app/data')
const { DELINKED } = require('../../../app/constants/scheme-ids')

jest.mock('../../../app/data', () => ({
  sequelize: {
    transaction: jest.fn()
  }
}))

jest.mock('../../../app/retention/find-delinked-calculations', () => ({
  findDelinkedCalculations: jest.fn()
}))

jest.mock('../../../app/retention/remove-d365', () => ({
  removeD365: jest.fn()
}))

jest.mock('../../../app/retention/remove-delinked-calculations', () => ({
  removeDelinkedCalculations: jest.fn()
}))

jest.mock('../../../app/retention/interm', () => ({
  findIntermPaymentRefs: jest.fn(),
  removeEtlIntermAppCalcResultsDelinkPayments: jest.fn(),
  removeEtlIntermApplicationClaim: jest.fn(),
  removeEtlIntermApplicationContract: jest.fn(),
  removeEtlIntermApplicationPayment: jest.fn(),
  removeEtlIntermCalcOrg: jest.fn(),
  removeEtlIntermFinanceDax: jest.fn(),
  removeEtlIntermPaymentrefAgreementDates: jest.fn(),
  removeEtlIntermPaymentrefApplication: jest.fn(),
  removeEtlIntermPaymentrefOrg: jest.fn(),
  removeEtlIntermTotal: jest.fn(),
  removeEtlIntermTotalClaim: jest.fn(),
  removeEtlIntermTotalZeroValues: jest.fn(),
  findIntermAppCalcResultsDelinkPayments: jest.fn(),
  removeEtlIntermOrg: jest.fn()
}))

jest.mock('../../../app/retention/stage', () => ({
  removeEtlStageAppCalcResultsDelinkPayments: jest.fn(),
  removeEtlStageApplicationDetail: jest.fn(),
  removeEtlStageAppsPaymentNotification: jest.fn(),
  removeEtlStageCalculationDetails: jest.fn(),
  removeEtlStageCssContractApplications: jest.fn(),
  findStageCssContractApps: jest.fn(),
  removeEtlStageCssContracts: jest.fn(),
  removeEtlStageFinanceDax: jest.fn(),
  removeEtlStageTclcPiiPayClaimSfimtOption: jest.fn(),
  findStageAppDetails: jest.fn(),
  removeEtlStageDefraLinks: jest.fn(),
  findSbisWithNoOtherCalculations: jest.fn(),
  removeEtlStageBusinessAddressContactV: jest.fn(),
  removeEtlStageOrganisation: jest.fn()
}))

const {
  findDelinkedCalculations
} = require('../../../app/retention/find-delinked-calculations')

const {
  removeD365
} = require('../../../app/retention/remove-d365')

const {
  removeDelinkedCalculations
} = require('../../../app/retention/remove-delinked-calculations')

const {
  findIntermPaymentRefs,
  removeEtlIntermAppCalcResultsDelinkPayments,
  removeEtlIntermApplicationClaim,
  removeEtlIntermApplicationContract,
  removeEtlIntermApplicationPayment,
  removeEtlIntermCalcOrg,
  removeEtlIntermFinanceDax,
  removeEtlIntermPaymentrefAgreementDates,
  removeEtlIntermPaymentrefApplication,
  removeEtlIntermPaymentrefOrg,
  removeEtlIntermTotal,
  removeEtlIntermTotalClaim,
  removeEtlIntermTotalZeroValues,
  findIntermAppCalcResultsDelinkPayments,
  removeEtlIntermOrg
} = require('../../../app/retention/interm')

const {
  removeEtlStageAppCalcResultsDelinkPayments,
  removeEtlStageApplicationDetail,
  removeEtlStageAppsPaymentNotification,
  removeEtlStageCalculationDetails,
  removeEtlStageCssContractApplications,
  findStageCssContractApps,
  removeEtlStageCssContracts,
  removeEtlStageFinanceDax,
  removeEtlStageTclcPiiPayClaimSfimtOption,
  findStageAppDetails,
  removeEtlStageDefraLinks,
  findSbisWithNoOtherCalculations,
  removeEtlStageBusinessAddressContactV,
  removeEtlStageOrganisation
} = require('../../../app/retention/stage')

describe('removeAgreementData', () => {
  const retentionDataDelinked = {
    simplifiedAgreementNumber: 'AGR-001',
    frn: 123456,
    schemeId: DELINKED
  }
  const retentionDataNotDelinked = {
    simplifiedAgreementNumber: 'AGR-002',
    frn: 654321,
    schemeId: 1
  }
  let transaction

  beforeEach(() => {
    jest.clearAllMocks()

    transaction = {
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue()
    }
    db.sequelize.transaction.mockResolvedValue(transaction)
  })

  test('commits transaction and returns early if schemeId is not DELINKED', async () => {
    await removeAgreementData(retentionDataNotDelinked)

    expect(db.sequelize.transaction).toHaveBeenCalledTimes(1)
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(transaction.rollback).not.toHaveBeenCalled()

    expect(findDelinkedCalculations).not.toHaveBeenCalled()
  })

  test('commits transaction and returns early if no calculations found', async () => {
    findDelinkedCalculations.mockResolvedValue([])

    await removeAgreementData(retentionDataDelinked)

    expect(db.sequelize.transaction).toHaveBeenCalledTimes(1)
    expect(findDelinkedCalculations).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      retentionDataDelinked.frn,
      transaction
    )
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(transaction.rollback).not.toHaveBeenCalled()
  })

  test('removes all related data when calculations exist', async () => {
    const calculations = [
      { calculationId: 101, sbi: 1111 },
      { calculationId: 102, sbi: 2222 }
    ]
    const sbisForEtlRemoval = [1111]

    const intermFinanceDaxes = [
      { paymentRef: 'PR-1' },
      { paymentRef: 'PR-2' }
    ]

    const intermAppCalcResultsDelinkPayments = [
      { calculationId: 201 },
      { calculationId: 202 }
    ]

    const stageCssContractApplications = [
      { calculationId: 301 },
      { calculationId: 302 }
    ]

    const stageApplicationDetails = [
      { subjectId: 'SUBJ-1' },
      { subjectId: 'SUBJ-2' }
    ]

    findDelinkedCalculations.mockResolvedValue(calculations)
    findSbisWithNoOtherCalculations.mockResolvedValue(sbisForEtlRemoval)
    findIntermPaymentRefs.mockResolvedValue(intermFinanceDaxes)
    findIntermAppCalcResultsDelinkPayments.mockResolvedValue(intermAppCalcResultsDelinkPayments)
    findStageCssContractApps.mockResolvedValue(stageCssContractApplications)
    findStageAppDetails.mockResolvedValue(stageApplicationDetails)

    removeEtlIntermAppCalcResultsDelinkPayments.mockResolvedValue()
    removeEtlIntermApplicationClaim.mockResolvedValue()
    removeEtlIntermApplicationContract.mockResolvedValue()
    removeEtlIntermApplicationPayment.mockResolvedValue()
    removeEtlIntermCalcOrg.mockResolvedValue()
    removeEtlIntermFinanceDax.mockResolvedValue()
    removeEtlIntermOrg.mockResolvedValue()
    removeEtlIntermPaymentrefAgreementDates.mockResolvedValue()
    removeEtlIntermPaymentrefApplication.mockResolvedValue()
    removeEtlIntermPaymentrefOrg.mockResolvedValue()
    removeEtlIntermTotal.mockResolvedValue()
    removeEtlIntermTotalClaim.mockResolvedValue()
    removeEtlIntermTotalZeroValues.mockResolvedValue()

    removeEtlStageAppCalcResultsDelinkPayments.mockResolvedValue()
    removeEtlStageApplicationDetail.mockResolvedValue()
    removeEtlStageAppsPaymentNotification.mockResolvedValue()
    removeEtlStageBusinessAddressContactV.mockResolvedValue()
    removeEtlStageCalculationDetails.mockResolvedValue()
    removeEtlStageCssContractApplications.mockResolvedValue()
    removeEtlStageCssContracts.mockResolvedValue()
    removeEtlStageDefraLinks.mockResolvedValue()
    removeEtlStageFinanceDax.mockResolvedValue()
    removeEtlStageOrganisation.mockResolvedValue()
    removeEtlStageTclcPiiPayClaimSfimtOption.mockResolvedValue()

    removeD365.mockResolvedValue()
    removeDelinkedCalculations.mockResolvedValue()

    await removeAgreementData(retentionDataDelinked)

    expect(db.sequelize.transaction).toHaveBeenCalledTimes(1)

    expect(findDelinkedCalculations).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      retentionDataDelinked.frn,
      transaction
    )

    expect(findSbisWithNoOtherCalculations).toHaveBeenCalledWith(
      calculations.map(c => c.sbi),
      calculations.map(c => c.calculationId),
      transaction
    )

    expect(findIntermPaymentRefs).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )

    expect(findIntermAppCalcResultsDelinkPayments).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      retentionDataDelinked.frn,
      transaction
    )

    expect(findStageCssContractApps).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      retentionDataDelinked.frn,
      transaction
    )
    expect(findStageAppDetails).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )

    expect(removeEtlIntermAppCalcResultsDelinkPayments).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      retentionDataDelinked.frn,
      transaction
    )
    expect(removeEtlIntermApplicationClaim).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )
    expect(removeEtlIntermApplicationContract).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )
    expect(removeEtlIntermApplicationPayment).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )
    expect(removeEtlIntermCalcOrg).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      retentionDataDelinked.frn,
      transaction
    )
    expect(removeEtlIntermFinanceDax).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )
    expect(removeEtlIntermOrg).toHaveBeenCalledWith(
      sbisForEtlRemoval,
      transaction
    )
    const intermPaymentRefs = intermFinanceDaxes.map(i => i.paymentRef)
    expect(removeEtlIntermPaymentrefAgreementDates).toHaveBeenCalledWith(
      intermPaymentRefs,
      transaction
    )
    expect(removeEtlIntermPaymentrefApplication).toHaveBeenCalledWith(
      intermPaymentRefs,
      transaction
    )
    expect(removeEtlIntermPaymentrefOrg).toHaveBeenCalledWith(
      intermPaymentRefs,
      retentionDataDelinked.frn,
      transaction
    )
    expect(removeEtlIntermTotal).toHaveBeenCalledWith(
      intermPaymentRefs,
      transaction
    )
    expect(removeEtlIntermTotalClaim).toHaveBeenCalledWith(
      intermPaymentRefs,
      transaction
    )
    expect(removeEtlIntermTotalZeroValues).toHaveBeenCalledWith(
      intermPaymentRefs,
      transaction
    )

    const appCalcResultsCalcIds = intermAppCalcResultsDelinkPayments.map(i => i.calculationId)
    expect(removeEtlStageAppCalcResultsDelinkPayments).toHaveBeenCalledWith(
      appCalcResultsCalcIds,
      transaction
    )
    expect(removeEtlStageApplicationDetail).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )
    expect(removeEtlStageAppsPaymentNotification).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )
    expect(removeEtlStageBusinessAddressContactV).toHaveBeenCalledWith(
      sbisForEtlRemoval,
      transaction
    )
    expect(removeEtlStageCalculationDetails).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )
    expect(removeEtlStageCssContractApplications).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )
    const cssContractCalcIds = stageCssContractApplications.map(scca => scca.calculationId)
    expect(removeEtlStageCssContracts).toHaveBeenCalledWith(
      cssContractCalcIds,
      transaction
    )
    const appDetailSubjectIds = stageApplicationDetails.map(sad => sad.subjectId)
    expect(removeEtlStageDefraLinks).toHaveBeenCalledWith(
      appDetailSubjectIds,
      transaction
    )
    expect(removeEtlStageFinanceDax).toHaveBeenCalledWith(
      intermPaymentRefs,
      transaction
    )
    expect(removeEtlStageOrganisation).toHaveBeenCalledWith(
      sbisForEtlRemoval,
      transaction
    )
    expect(removeEtlStageTclcPiiPayClaimSfimtOption).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      transaction
    )

    const calculationIds = calculations.map(c => c.calculationId)
    expect(removeD365).toHaveBeenCalledWith(
      calculationIds,
      transaction
    )
    expect(removeDelinkedCalculations).toHaveBeenCalledWith(
      calculationIds,
      transaction
    )

    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(transaction.rollback).not.toHaveBeenCalled()
  })

  test('rolls back transaction and throws error if any step fails', async () => {
    findDelinkedCalculations.mockResolvedValue([
      { calculationId: 1, sbi: 10 }
    ])

    const error = new Error('Failure in removeD365')
    removeD365.mockRejectedValue(error)

    findSbisWithNoOtherCalculations.mockResolvedValue([10])
    findIntermPaymentRefs.mockResolvedValue([])
    findIntermAppCalcResultsDelinkPayments.mockResolvedValue([])
    findStageCssContractApps.mockResolvedValue([])
    findStageAppDetails.mockResolvedValue([])

    removeEtlIntermAppCalcResultsDelinkPayments.mockResolvedValue()
    removeEtlIntermApplicationClaim.mockResolvedValue()
    removeEtlIntermApplicationContract.mockResolvedValue()
    removeEtlIntermApplicationPayment.mockResolvedValue()
    removeEtlIntermCalcOrg.mockResolvedValue()
    removeEtlIntermFinanceDax.mockResolvedValue()
    removeEtlIntermOrg.mockResolvedValue()
    removeEtlIntermPaymentrefAgreementDates.mockResolvedValue()
    removeEtlIntermPaymentrefApplication.mockResolvedValue()
    removeEtlIntermPaymentrefOrg.mockResolvedValue()
    removeEtlIntermTotal.mockResolvedValue()
    removeEtlIntermTotalClaim.mockResolvedValue()
    removeEtlIntermTotalZeroValues.mockResolvedValue()
    removeEtlStageAppCalcResultsDelinkPayments.mockResolvedValue()
    removeEtlStageApplicationDetail.mockResolvedValue()
    removeEtlStageAppsPaymentNotification.mockResolvedValue()
    removeEtlStageBusinessAddressContactV.mockResolvedValue()
    removeEtlStageCalculationDetails.mockResolvedValue()
    removeEtlStageCssContractApplications.mockResolvedValue()
    removeEtlStageCssContracts.mockResolvedValue()
    removeEtlStageDefraLinks.mockResolvedValue()
    removeEtlStageFinanceDax.mockResolvedValue()
    removeEtlStageOrganisation.mockResolvedValue()
    removeEtlStageTclcPiiPayClaimSfimtOption.mockResolvedValue()
    removeDelinkedCalculations.mockResolvedValue()

    await expect(removeAgreementData(retentionDataDelinked)).rejects.toThrow('Failure in removeD365')

    expect(transaction.rollback).toHaveBeenCalledTimes(1)
    expect(transaction.commit).not.toHaveBeenCalled()
  })
})
