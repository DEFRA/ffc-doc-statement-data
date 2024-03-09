const mockAction1 = {
  actionId: 1,
  calculationId: 1234567,
  fundingCode: '80243',
  groupName: 'Making grass seem normal',
  actionCode: 'GR45S',
  actionName: 'Grass for the farm looks like regular grass',
  rate: '£590 per ha',
  landArea: 0.660000,
  uom: 'ha',
  annualValue: 389.4,
  quarterlyValue: 99.99,
  overDeclarationPenalty: 0.00,
  quarterlyPaymentAmount: 99.99
}

const mockAction2 = {
  actionId: 2,
  calculationId: 1234568,
  fundingCode: '80141',
  groupName: 'Secondary action for new grasses',
  actionCode: 'GR455',
  actionName: 'Grass for the farm looks like improved grass',
  rate: '£990 per ha',
  landArea: 0.960000,
  uom: 'ha',
  annualValue: 589.4,
  quarterlyValue: 79.99,
  overDeclarationPenalty: 0.00,
  quarterlyPaymentAmount: 79.99
}

const mockAction3 = {
  actionId: 3,
  calculationId: 1234567,
  fundingCode: '80280',
  groupName: 'Actions for grass removal',
  actionCode: 'GR450',
  actionName: 'Grass for the farm looks like no grass left',
  rate: '£590 per ha',
  landArea: 0.660000,
  uom: 'ha',
  annualValue: 389.4,
  quarterlyValue: 99.99,
  overDeclarationPenalty: 0.00,
  quarterlyPaymentAmount: 99.99
}

module.exports = {
  mockAction1,
  mockAction2,
  mockAction3
}
