const db = require('../../data')

const removeEtlIntermFinanceDax = async (agreementreference, transaction) => {
  await db.etlIntermFinanceDax.destroy({
    where: {
      agreementreference
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermFinanceDax
}
