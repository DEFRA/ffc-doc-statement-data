const config = require('./config')
const { Database } = require('ffc-database')
const etlTables = require('./constants/etl-tables')
const tables = require('./constants/tables')

const dbConfig = config.dbConfig[config.env]

const database = new Database({ ...dbConfig, tables: { ...etlTables, ...tables } })

module.exports = database.connect()
