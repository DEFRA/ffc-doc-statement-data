const mockDax1 = {
  paymentReference: 'IN0056999',
  calculationReference: 1234569,
  paymentPeriod: '1st May 2024 to 31st July 2024',
  paymentAmount: -3495,
  transactionDate: new Date(2022, 7, 5, 15, 30, 10, 120),
  type: 'dax'
}

const mockDax2 = {
  paymentReference: 'IN0056990',
  calculationId: 1234569,
  paymentPeriod: '1st May 2024 to 31st July 2024',
  paymentAmount: -4495,
  transactionDate: new Date(2022, 7, 5, 15, 30, 10, 120),
  datePublished: new Date(2023, 7, 5, 15, 30, 10, 120)
}

const mockDax3 = {
  paymentReference: 'IN0056991',
  calculationId: 1234568,
  paymentPeriod: '1st May 2024 to 31st July 2024',
  paymentAmount: -5495,
  transactionDate: new Date(2022, 7, 5, 15, 30, 10, 120)
}

const mockDaxDelinked1 = {
  paymentReference: 'PY0056991',
  calculationId: 12345689,
  paymentPeriod: '2024',
  paymentAmount: -5495,
  transactionDate: new Date(2022, 7, 5, 15, 30, 10, 120)
}

module.exports = {
  mockDax1,
  mockDax2,
  mockDax3,
  mockDaxDelinked1
}
