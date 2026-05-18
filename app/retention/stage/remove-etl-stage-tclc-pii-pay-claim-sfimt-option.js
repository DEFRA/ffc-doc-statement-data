const db = require('../../data')

const removeEtlStageTclcPiiPayClaimSfimtOption = async (applicationId, transaction) => {
  await db.etlStageTclcPiiPayClaimSfimtOption.destroy({
    where: {
      applicationId
    },
    transaction
  })
}

module.exports = {
  removeEtlStageTclcPiiPayClaimSfimtOption
}
