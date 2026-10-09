const isProd = () => process.env.NODE_ENV === 'production'

const pool = {
  acquire: 7200000,
  max: 20,
  min: 0
}

const dbConfig = {
  database: process.env.POSTGRES_DB || 'ffc_doc_statement_data',
  dialectOptions: {
    ssl: isProd(),
    statement_timeout: 7200000
  },
  host: process.env.POSTGRES_HOST || 'ffc-doc-statement-data-postgres',
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  logging: process.env.POSTGRES_LOGGING || false,
  pool,
  schema: process.env.POSTGRES_SCHEMA_NAME || 'public',
  username: process.env.POSTGRES_USERNAME
}

module.exports = {
  development: dbConfig,
  production: dbConfig,
  test: dbConfig
}
