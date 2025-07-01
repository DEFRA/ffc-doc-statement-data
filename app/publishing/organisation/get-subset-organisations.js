const db = require('../../data')

const getSubsetOrganisations = async (sbiArray) => {
  return db.organisation.findAll({
    lock: true,
    skipLocked: true,
    where: {
      [db.Sequelize.Op.and]: [
        {
          sbi: { [db.Sequelize.Op.in]: sbiArray }
        },
        {
          [db.Sequelize.Op.or]: [
            { published: null },
            { published: { [db.Sequelize.Op.lt]: db.sequelize.col('updated') } }
          ]
        }
      ]
    },
    attributes: ['sbi', 'addressLine1', 'addressLine2', 'addressLine3', 'city', 'county', 'postcode', 'emailAddress', 'frn', 'name', 'updated'],
    raw: true
  })
}

module.exports = getSubsetOrganisations
