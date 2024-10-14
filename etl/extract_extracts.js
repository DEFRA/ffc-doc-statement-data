const StreamZip = require('node-stream-zip')
const path = require("path")
const { readdirSync, rmSync, mkdirSync } = require("fs")

const ZIP_FILE_ERROR = "Zip file must contain either a set of csv files, or a set of zip files which each contain csv files"

const FILE_PATH_LOOKUP = {
  "^SFI23_STMT_APPLICATION_DETAILS_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "Application_Detail",
  "^SFI23_STMT_APPS_PAYMENT_NOTIFICATIONS_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "Apps_Payment_Notification",
  "^SFI23_STMT_APPS_TYPES_V_CHANGE_LOG_\\d{8}_\\d{6}.csv": "Apps_Types",
  "^SFI23_STMT_BUSINESS_ADDRESS_CONTACT_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "Business_address_contact_v",
  "^SFI23_STMT_CALCULATION_DETAILS_MV_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "Calculations_Details_MV",
  "^SFI23_STMT_CSS_CONTRACT_APPLICATIONS_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "CSS_Contract_Applications",
  "^SFI23_STMT_CSS_CONTRACTS_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "CSS_Contract",
  "^SFI23_STMT_CSS_OPTIONS_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "CSS_Options",
  "^SFI23_STMT_DEFRA_LINKS_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "Defra_Links",
  "^SFI23_STMT_FINANCE_DAX_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "Finance_Dax",
  "^SFI23_STMT_ORGANISATION_SFI_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "Organization",
  "^SFI23_STMT_TCLC_PII_PAY_CLAIM_SFIMT_OPTION_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "capd_dwh_ods.tclc_pii_pay_claim_sfimt_option",
  "^SFI23_STMT_TCLC_PII_PAY_CLAIM_SFIMT_V_CHANGE_LOG_\\d{8}_\\d{6}.csv$": "tclc_pii_pay_claim_sfimt"
}

let zip

class ZipEntry {
  size
  isDirectory = false;
  name
  extractDate
  extn
  constructor({ size, isDirectory, name, extractDate, extn }) {
    this.size = size
    this.isDirectory = isDirectory
    this.name = name
    this.extractDate = extractDate
    this.extn = extn
  }
}

function openExtractsZipFile() {
  const zipFilePath = path.join(process.cwd(), 'etl/dwh_extracts/extracts.zip')
  zip = new StreamZip.async({ file: zipFilePath })
}

async function closeExtractsZipFile() {
  await zip.close()
}

function getDateFromFileName(fileName) {
  const dateString = fileName.split("_")[0]
  const timeString = fileName.split("_")[1].split(".")[0]
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  const hour = timeString.substring(0, 2)
  const minutes = timeString.substring(2, 4)
  const seconds = timeString.substring(4, 6)
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minutes),
    parseInt(seconds)
  )
}

async function listEntries() {
  const entries = await zip.entries()
  const contents = []
  for (const entry of Object.values(entries)) {
    contents.push(new ZipEntry({
      isDirectory: entry.isDirectory,
      size: entry.isDirectory ? 0 : entry.size,
      name: entry.name,
      extractDate: getDateFromFileName(entry.name),
      extn: entry.name.split(".")[1]
    }))
  }
  return contents.sort((a, b) => a.extractDate < b.extractDate)
}

function isAllZipFiles(entries) {
  return entries.every(e => e.extn === 'zip')
}

function isAllCSVFiles(entries) {
  return entries.every(e => e.extn === 'csv')
}

function validateEntries(entries) {
  return isAllZipFiles(entries) ||
    isAllCSVFiles(entries)
}

async function deleteAllFilesInFolder(folder) {

}

async function extractZipFileEntryToTempFolder(entry) {
  console.log(`Extracting ${entry.name} to /tmp/${entry.name}`)
  await zip.extract(`${entry.name}`, `/tmp/${entry.name}`)
}

async function extractZipFileToTempFolder() {
  //fs.mkdirSync('extracted')
  await zip.extract(null, './extracted')
}

function getOutputPathFromFileName(fileName) {
  let outputPath
  for (const [key, value] of Object.entries(FILE_PATH_LOOKUP)) {
    if (fileName.match(new RegExp(key))) {
      outputPath = value
      break
    }
  }
  return outputPath
}

async function processZipFile(path) {
  const tempZipFile = new StreamZip.async({ file: path })
  const entries = await tempZipFile.entries()
  for (const entry of Object.values(entries)) {
    const outputPath = getOutputPathFromFileName(entry.name)
    const fullOutputPath = `./etl/dwh_extracts/${outputPath}/export.csv`
    tempZipFile.extract(entry.name, fullOutputPath)
  }
}

async function processCSVFile(entry) {

}

async function processZipFiles(entries) {
  entries.forEach(async (entry) => {
    await processZipFile(entry)
  })
}

async function processCSVFiles(entries) {

}

async function processEntries(entries) {
  if (isAllZipFiles(entries)) {
    await processZipFiles(entries)
  }
  else if (isAllCSVFiles(entries)) {
    await processCSVFiles
  }
  else {
    console.log(ZIP_FILE_ERROR)
  }
}

async function flushExtractDirectories() {
  for (const [key, value] of Object.entries(FILE_PATH_LOOKUP)) {
    const dir = path.join(process.cwd(), `etl/dwh_extracts/${value}`)
    readdirSync(dir).forEach(f => rmSync(`${dir}/${f}`))
  }
}

(async () => {
  //openExtractsZipFile()
  // const contents = await listEntries()
  // if (!validateEntries(contents)) {
  //   console.log(ZIP_FILE_ERROR)
  //   process.exit()
  // }
  //await processEntries(contents)
  //extractZipFileToTempFolder()
  //closeExtractsZipFile()
  flushExtractDirectories()
  processZipFile('./etl/dwh_extracts/extracts.zip')
  //flushExtractDirectories()
})()
