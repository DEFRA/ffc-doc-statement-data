const { ORGANISATION, DELINKED_CALCULATION, D365 } = require('../../constants/types')
const getUnpublishedD365 = require('../d365/get-unpublished')
const { publishingConfig } = require('../../config')
const getRandomDelinkedCalculation = require('../delinkedCalculation/get-subset-delinked-calculation')
const getRandomOrganisations = require('../organisation/get-subset-organisations')
const sendSubset = require('./send-subset')
const { DELINKED } = require('../../constants/schemes')
const updateSubsetCheck = require('./update-subset-check')

const sendDelinkedSubset = async () => {
  const randomD365Records = await getUnpublishedD365(null, publishingConfig.delinked.processSubsetAmount, true)
  if (randomD365Records.length) {
    const d365CalculationIds = randomD365Records.map(record => record.calculationReference)
    const randomDelinkedCalculations = await getRandomDelinkedCalculation(d365CalculationIds)
    const dcSBIs = randomDelinkedCalculations.map(record => record.sbi)
    const randomOrgs = await getRandomOrganisations(dcSBIs)
    const tablesToTarget = [{
      type: ORGANISATION,
      dataToPublish: randomOrgs
    }, {
      type: DELINKED_CALCULATION,
      dataToPublish: randomDelinkedCalculations
    }, {
      type: D365,
      dataToPublish: randomD365Records
    }]
    await sendSubset(tablesToTarget)
    await updateSubsetCheck(DELINKED, true)
  } else {
    console.log('No records identified to send in Delinked subset')
  }
}

module.exports = sendDelinkedSubset
