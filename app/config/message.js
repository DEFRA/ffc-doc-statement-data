const Joi = require('joi')

const mqSchema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object(),
    managedIdentityClientId: Joi.string().optional()
  },
  dataTopic: {
    address: Joi.string()
  },
  updatesSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
  },
  alertTopic: {
    address: Joi.string()
  }
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined,
    managedIdentityClientId: process.env.AZURE_CLIENT_ID
  },
  dataTopic: {
    address: process.env.DATA_TOPIC_ADDRESS
  },
  updatesSubscription: {
    address: process.env.DEMOGRAPHICS_SUBSCRIPTION_ADDRESS,
    topic: process.env.DEMOGRAPHICS_TOPIC_ADDRESS,
    type: 'subscription'
  },
  alertTopic: {
    address: process.env.ALERT_TOPIC_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const dataTopic = { ...mqResult.value.messageQueue, ...mqResult.value.dataTopic }
const updatesSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.updatesSubscription }
const alertTopic = { ...mqResult.value.messageQueue, ...mqResult.value.alertTopic }

module.exports = {
  dataTopic,
  updatesSubscription,
  alertTopic
}
