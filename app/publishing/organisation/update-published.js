const db = require('../../data')

const updatePublished = async (sbi, transaction) => {
  const org = await db.organisation.findOne({
    where: { sbi },
    transaction
  })

  if (!org) {
    throw new Error(`Organisation with SBI ${sbi} not found`)
  }

  const noAddress = !org.addressLine1 && !org.addressLine2 && !org.addressLine3 && !org.city && !org.county && !org.postcode

  if (noAddress) {
    console.log(`Deleting organisation ${sbi} — no address present`)
    await db.organisation.destroy({
      where: { sbi },
      transaction
    })
    return
  }

  await db.organisation.update(
    { published: new Date() },
    { where: { sbi }, transaction }
  )
}

module.exports = updatePublished
