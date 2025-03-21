const { publishingConfig } = require('../config')
const sendUpdates = require('./send-updates')
const { ORGANISATION, DELINKED, CALCULATION, TOTAL, DAX, D365 } = require('./types')

const updateTypes = [ORGANISATION, DELINKED, CALCULATION, TOTAL, DAX, D365]

async function * updateGenerator () {
  for (const type of updateTypes) {
    yield sendUpdates(type)
  }
}

const start = async () => {
  try {
    console.log('Ready to publish data')

    for await (const promise of updateGenerator()) {
      await promise
    }

    console.log('All outstanding valid datasets published')
  } catch (err) {
    console.error('Error during publishing:', err)
  } finally {
    setTimeout(start, publishingConfig.pollingInterval)
  }
}

module.exports = { start }
