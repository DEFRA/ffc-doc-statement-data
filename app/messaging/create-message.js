const createMessage = (body, type, source, options) => {
  return {
    body,
    type,
    source,
    ...options
  }
}

module.exports = createMessage
