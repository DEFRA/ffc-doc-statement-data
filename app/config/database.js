const { DefaultAzureCredential, getBearerTokenProvider } = require('@azure/identity')

function isProd () {
  return process.env.NODE_ENV === 'production'
}

const hooks = {
  beforeConnect: async (cfg) => {
    if (isProd()) {
      const credential = new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID })
      const tokenProvider = getBearerTokenProvider(
        credential,
        'https://ossrdbms-aad.database.windows.net/.default'
      )
      cfg.password = tokenProvider
    }
  }
}

const pool = {
  acquire: 7200000,
  max: 20,
  min: 0
}

const retry = {
  backoffBase: 500,
  backoffExponent: 1.1,
  match: [/SequelizeConnectionError/],
  max: 10,
  name: 'connection',
  timeout: 7200000
}

const dbConfig = {
  database: process.env.POSTGRES_DB || 'ffc_doc_statement_data',
  dialect: 'postgres',
  dialectOptions: {
    ssl: isProd(),
    statement_timeout: 7200000
  },
  hooks,
  host: process.env.POSTGRES_HOST || 'ffc-doc-statement-data-postgres',
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  logging: process.env.POSTGRES_LOGGING || false,
  retry,
  pool,
  schema: process.env.POSTGRES_SCHEMA_NAME || 'public',
  username: process.env.POSTGRES_USERNAME
}

module.exports = {
  development: dbConfig,
  production: dbConfig,
  test: dbConfig
}
