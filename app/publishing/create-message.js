const createMessage = (body, type) => {
  return {
    body,
    type: `uk.gov.doc.statement.data.${type}`,
    source: 'ffc-doc-statement-data'
  }
}

module.exports = createMessage
