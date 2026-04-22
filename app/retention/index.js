const db = require('../data')
const { DELINKED } = require('../constants/scheme-ids')
const { findDelinkedCalculations } = require('./find-delinked-calculations')
const { removeD365 } = require('./remove-d365')
const { removeDelinkedCalculations } = require('./remove-delinked-calculations')
const { findIntermPaymentRefs, removeEtlIntermAppCalcResultsDelinkPayments, removeEtlIntermApplicationClaim, removeEtlIntermApplicationContract, removeEtlIntermApplicationPayment, removeEtlIntermCalcOrg, removeEtlIntermFinanceDax, removeEtlIntermPaymentrefAgreementDates, removeEtlIntermPaymentrefApplication, removeEtlIntermPaymentrefOrg, removeEtlIntermTotal, removeEtlIntermTotalClaim, removeEtlIntermTotalZeroValues, findIntermAppCalcResultsDelinkPayments, removeEtlIntermOrg } = require('./interm')
const { removeEtlStageAppCalcResultsDelinkPayments, removeEtlStageApplicationDetail, removeEtlStageAppsPaymentNotification, removeEtlStageCalculationDetails, removeEtlStageCssContractApplications, findStageCssContractApps, removeEtlStageCssContracts, removeEtlStageFinanceDax, removeEtlStageTclcPiiPayClaimSfimtOption, findStageAppDetails, removeEtlStageDefraLinks, findSbisWithNoOtherCalculations, removeEtlStageBusinessAddressContactV, removeEtlStageOrganisation } = require('./stage')

const removeAgreementData = async (retentionData) => {
  const transaction = await db.sequelize.transaction()
  try {
    const { simplifiedAgreementNumber, frn, schemeId } = retentionData

    if (schemeId !== DELINKED) {
      await transaction.commit()
      return
    }

    const calculations = await findDelinkedCalculations(simplifiedAgreementNumber, frn, transaction)
    const calculationIds = calculations.map(c => c.calculationId)
    if (calculations.length === 0) {
      await transaction.commit()
      return
    }

    const sbis = calculations.map(c => c.sbi)
    const sbisForEtlRemoval = await findSbisWithNoOtherCalculations(sbis, calculationIds, transaction)

    // Remove ETL interim data
    const intermFinanceDaxes = await findIntermPaymentRefs(simplifiedAgreementNumber, transaction)
    const intermPaymentRefs = intermFinanceDaxes.map(ifd => ifd.paymentRef)

    const intermAppCalcResultsDelinkPayments = await findIntermAppCalcResultsDelinkPayments(simplifiedAgreementNumber, frn, transaction)
    const appCalcResultsCalcIds = intermAppCalcResultsDelinkPayments.map(iacrdp => iacrdp.calculationId)

    await removeEtlIntermAppCalcResultsDelinkPayments(simplifiedAgreementNumber, frn, transaction)
    await removeEtlIntermApplicationClaim(simplifiedAgreementNumber, transaction)
    await removeEtlIntermApplicationContract(simplifiedAgreementNumber, transaction)
    await removeEtlIntermApplicationPayment(simplifiedAgreementNumber, transaction)
    await removeEtlIntermCalcOrg(simplifiedAgreementNumber, frn, transaction)
    await removeEtlIntermFinanceDax(simplifiedAgreementNumber, transaction)
    await removeEtlIntermOrg(sbisForEtlRemoval, transaction)
    await removeEtlIntermPaymentrefAgreementDates(intermPaymentRefs, transaction)
    await removeEtlIntermPaymentrefApplication(intermPaymentRefs, transaction)
    await removeEtlIntermPaymentrefOrg(intermPaymentRefs, frn, transaction)
    await removeEtlIntermTotal(intermPaymentRefs, transaction)
    await removeEtlIntermTotalClaim(intermPaymentRefs, transaction)
    await removeEtlIntermTotalZeroValues(intermPaymentRefs, transaction)

    // Remove ETL staging data
    const stageCssContractApplications = await findStageCssContractApps(simplifiedAgreementNumber, frn, transaction)
    const cssContractCalcIds = stageCssContractApplications.map(scca => scca.calculationId)
    const stageApplicationDetails = await findStageAppDetails(simplifiedAgreementNumber, transaction)
    const appDetailSubjectIds = stageApplicationDetails.map(sad => sad.subjectId)

    await removeEtlStageAppCalcResultsDelinkPayments(appCalcResultsCalcIds, transaction)
    await removeEtlStageApplicationDetail(simplifiedAgreementNumber, transaction)
    await removeEtlStageAppsPaymentNotification(simplifiedAgreementNumber, transaction)
    await removeEtlStageBusinessAddressContactV(sbisForEtlRemoval, transaction)
    await removeEtlStageCalculationDetails(simplifiedAgreementNumber, transaction)
    await removeEtlStageCssContractApplications(simplifiedAgreementNumber, transaction)
    await removeEtlStageCssContracts(cssContractCalcIds, transaction)
    await removeEtlStageDefraLinks(appDetailSubjectIds, transaction)
    await removeEtlStageFinanceDax(intermPaymentRefs, transaction)
    await removeEtlStageOrganisation(sbisForEtlRemoval, transaction)
    await removeEtlStageTclcPiiPayClaimSfimtOption(simplifiedAgreementNumber, transaction)

    // Remove sanitized data
    await removeD365(calculationIds, transaction)
    await removeDelinkedCalculations(calculationIds, transaction)

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

module.exports = {
  removeAgreementData
}
