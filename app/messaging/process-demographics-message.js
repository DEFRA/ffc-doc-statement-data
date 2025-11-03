const util = require('node:util')
const moment = require('moment')
const { getAddressLines } = require('./get-address-lines')
const { getSBI } = require('./get-sbi')
const db = require('../data')
const mqConfig = require('../config/message')
const { validateDemographicsData } = require('./validate-demographics-data')
const { VALIDATION } = require('../constants/error-categories')

const processDemographicsMessage = async (message, receiver) => {
  try {
    const receivedData = message.body
    const enqueuedTime = message.enqueuedTimeUtc
    console.log('Demographics update received:', util.inspect(receivedData, false, null, true))
    if (mqConfig.day0DateTime && moment(enqueuedTime).isBefore(moment(mqConfig.day0DateTime))) {
      console.log(`Message received before day 0 date time ${mqConfig.day0DateTime} - ignoring`)
      await receiver.completeMessage(message)
      return
    }
    const addressLines = getAddressLines(receivedData.address?.[0])
    const demographicsData = {
      name: receivedData.organisation?.organisationName,
      sbi: getSBI(receivedData),
      frn: receivedData.organisation?.firmId,
      ...addressLines,
      city: receivedData.address?.[0]?.city,
      county: receivedData.address?.[0]?.county,
      postcode: receivedData.address?.[0]?.postalCode,
      emailAddress: receivedData.digitalContact?.[0]?.digitalAddress,
      updated: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    validateDemographicsData(demographicsData)
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
    console.log('Demographics update processed')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process demographics message:', err)
    if (err.category === VALIDATION) {
      await receiver.deadLetterMessage(message)
    }
  }
}

module.exports = processDemographicsMessage
