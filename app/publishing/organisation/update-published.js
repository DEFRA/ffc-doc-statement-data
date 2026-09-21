const db = require('../../data')

const updatePublished = async (sbi, transaction) => {
  const org = (await db.organisation(transaction ?? undefined).where({ sbi }).first()) ?? null

  if (!org) {
    throw new Error(`Organisation with SBI ${sbi} not found`)
  }

  const noAddress = !org.addressLine1 && !org.addressLine2 && !org.addressLine3 && !org.city && !org.county && !org.postcode

  if (noAddress) {
    console.log(`Deleting organisation ${sbi} — no address present`)
    await db.organisation(transaction ?? undefined).where({ sbi }).del()
  } else {
    await db.organisation(transaction ?? undefined).where({ sbi }).update({ published: new Date() })
  }
}

module.exports = updatePublished
