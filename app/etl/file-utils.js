const fs = require('fs')
const readline = require('readline')

const getFirstLineNumber = async (filePath) => {
  const readable = fs.createReadStream(filePath)
  const reader = readline.createInterface({ input: readable })

  return new Promise((resolve, reject) => {
    reader.on('line', (line) => {
      reader.close()
      readable.destroy()
      resolve(parseInt(line.trim(), 10))
    })

    reader.on('error', (err) => {
      readable.destroy()
      reject(err)
    })
  })
}

const removeFirstLine = async (filePath) => {
  const data = await fs.promises.readFile(filePath, 'utf8')
  const lines = data.split('\n')
  const output = lines.slice(1).join('\n')
  await fs.promises.writeFile(filePath, output)
}

module.exports = {
  removeFirstLine,
  getFirstLineNumber
}
