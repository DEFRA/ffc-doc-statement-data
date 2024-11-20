const fs = require('fs')
const { parse } = require('csv-parse')

const getRowCount = (filePath) => {
  return new Promise((resolve, reject) => {
    const parser = parse({
      relaxColumnCount: true,
      skip_empty_lines: true,
      trim: true
    })

    let rowCount = 0
    let isFirstRow = true

    fs.createReadStream(filePath)
      .pipe(parser)
      .on('data', () => {
        if (isFirstRow) {
          isFirstRow = false
          return
        }
        rowCount++
      })
      .on('end', () => {
        resolve(rowCount)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

module.exports = {
  getRowCount
}
