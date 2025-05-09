const util = require('util')
const moment = require('moment')
const { getAddressLines } = require('./get-address-lines')
const { getSBI } = require('./get-sbi')
const db = require('../data')

const processDemographicsMessage = async (message, receiver) => {
  try {
    const receivedData = message.body
    console.log('Demographics update received:', util.inspect(receivedData, false, null, true))
    const addressLines = getAddressLines(receivedData.address?.[0])
    const demographicsData = {
      sbi: getSBI(receivedData),
      city: receivedData.address?.[0]?.city,
      county: receivedData.address?.[0]?.county,
      postcode: receivedData.address?.[0]?.postalCode,
      emailAddress: receivedData.digitalContact?.[0]?.digitalAddress,
      frn: receivedData.organisation?.firmId,
      name: receivedData.organisation?.organisationName,
      updated: moment().format('YYYY-MM-DD HH24:mm:ss'),
      published: null,
      ...addressLines
    }
    if (demographicsData.sbi) {
      const existingSBI = await db.organisation.findOne({
        where: {
          sbi: demographicsData.sbi
        }
      })
      if (existingSBI) {
        await db.organisation.update(demographicsData, {
          where: {
            sbi: existingSBI.sbi
          }
        })
      } else {
        await db.organisation.create(demographicsData)
      }
    }
    console.log('Demographics update processed')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process demographics message:', err)
  }
}

module.exports = processDemographicsMessage
