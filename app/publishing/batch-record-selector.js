const { delinkedCalculation, organisation, d365 } = require('../data/models')

async function getDelinkedBatchWithRelations (limit = 10) {
  console.log(`[${new Date().toISOString()}] Selecting up to ${limit} unprocessed delinkedCalculation records...`)
  const delinkedRecords = await delinkedCalculation.findAll({
    where: { processed: false },
    limit,
    raw: true
  })
  if (!delinkedRecords.length) {
    console.log(`[${new Date().toISOString()}] No unprocessed delinkedCalculation records found.`)
    return []
  }
  const sbis = delinkedRecords.map(r => r.sbi)
  console.log(`[${new Date().toISOString()}] Fetching related organisation and d365 records for ${sbis.length} SBIs...`)
  const [organisations, d365s] = await Promise.all([
    organisation.findAll({ where: { sbi: sbis }, raw: true }),
    d365.findAll({ where: { sbi: sbis }, raw: true })
  ])
  const orgMap = new Map(organisations.map(o => [o.sbi, o]))
  const d365Map = new Map(d365s.map(d => [d.sbi, d]))
  return delinkedRecords.map(delinked => ({
    delinked,
    organisation: orgMap.get(delinked.sbi),
    d365: d365Map.get(delinked.sbi)
  }))
}

module.exports = { getDelinkedBatchWithRelations }
