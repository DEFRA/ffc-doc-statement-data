const db = require('../../data')

const findStageAppDetails = async (applicationId, transaction) => {
  return db.etlStageApplicationDetail.findAll({
    attributes: ['calculationId'],
    where: {
      applicationId
    },
    transaction
  })
}

module.exports = {
  findStageAppDetails
}
