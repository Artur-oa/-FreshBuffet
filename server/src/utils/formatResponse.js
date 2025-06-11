function formatResponse(statusCode = 0, message = '', data = null, error = null) {
  return { statusCode, message, data, error };
}

module.exports = formatResponse;
