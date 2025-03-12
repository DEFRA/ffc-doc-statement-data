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

const removeFirstLine = async (stream) => {
  const transformStream = new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform (chunk, encoding, callback) {
      if (!this.firstLineRemoved) {
        this.firstLineRemoved = true
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
