const { Transform } = require('stream')

const getFirstLineNumber = async (stream) => {
  return new Promise((resolve, reject) => {
    const reader = require('readline').createInterface({ input: stream })

    reader.on('line', (line) => {
      reader.close()
      resolve(parseInt(line.trim(), 10))
    })

    reader.on('error', (err) => {
      reject(err)
    })
  })
}

const removeFirstLine = (stream) => {
  let firstLineSkipped = false

  const transformStream = new Transform({
    transform (chunk, encoding, callback) {
      const lines = chunk.toString().split('\n')

      if (!firstLineSkipped) {
        firstLineSkipped = true
        if (lines.length > 1) {
          this.push(lines.slice(1).join('\n') + (lines[lines.length - 1] ? '\n' : ''))
        }
        callback()
      } else {
        callback(null, chunk)
      }
    }
  })

  return stream.pipe(transformStream)
}
module.exports = {
  removeFirstLine,
  getFirstLineNumber
}
