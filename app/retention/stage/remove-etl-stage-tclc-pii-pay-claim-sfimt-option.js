const db = require('../../database')

const removeEtlStageTclcPiiPayClaimSfimtOption = async (applicationId, transaction) => {
  await db.etlStageTclcPiiPayClaimSfimtOption(transaction ?? undefined).where({ applicationId }).del()
}

module.exports = {
  removeEtlStageTclcPiiPayClaimSfimtOption
}
