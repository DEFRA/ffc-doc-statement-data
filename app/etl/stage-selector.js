const fs = require('fs').promises
const path = require('path')
const readline = require('readline')
const { spawn } = require('child_process')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function getStagingDirectories () {
  // Remove extra etl from path since we're already in that directory
  const stagingPath = path.join(__dirname, 'staging')
  const dirs = await fs.readdir(stagingPath, { withFileTypes: true })
  return dirs
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

function displayOptions (directories) {
  console.log('\nAvailable staging directories:')
  directories.forEach((dir, index) => {
    console.log(`${index + 1}: ${dir}`)
  })
}

function getStageFileName (dirName) {
  return `stage-${dirName}-extracts.js`
}

async function selectAndRunStaging () {
  try {
    const directories = await getStagingDirectories()
    displayOptions(directories)

    rl.question('\nSelect a number to run staging: ', (answer) => {
      const selection = parseInt(answer) - 1

      if (selection >= 0 && selection < directories.length) {
        const selectedDir = directories[selection]
        const stageFileName = getStageFileName(selectedDir)

        const scriptPath = path.join(
          __dirname,
          'staging',
          selectedDir,
          stageFileName
        )

        console.log(`Running staging for: ${selectedDir} using ${scriptPath}`)

        const stagingProcess = spawn('node', [scriptPath], { stdio: 'inherit' })

        stagingProcess.on('close', (code) => {
          console.log(`Staging process exited with code ${code}`)
          rl.close()
        })
      } else {
        console.log('Invalid selection')
        rl.close()
      }
    })
  } catch (error) {
    console.error('Error:', error)
    rl.close()
  }
}

selectAndRunStaging()
