const db = require('../../database')

const addressFields = ['addressLine1', 'addressLine2', 'addressLine3', 'city', 'county', 'postcode']

const hasNoAddress = (org) => addressFields.every(field => !org[field])

const updatePublished = async (sbi, transaction) => {
  const org = (await db.organisation(transaction ?? undefined).where({ sbi }).first()) ?? null

  if (!org) {
    throw new Error(`Organisation with SBI ${sbi} not found`)
  }

  if (hasNoAddress(org)) {
    console.log(`Deleting organisation ${sbi} — no address present`)
    await db.organisation(transaction ?? undefined).where({ sbi }).del()
  } else {
    await db.organisation(transaction ?? undefined).where({ sbi }).update({ published: new Date() })
  }
}

module.exports = updatePublished
