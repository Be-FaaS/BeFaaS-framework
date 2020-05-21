const lib = require('@faastermetrics/lib')
const { EUR_RATES } = require('../../currency/exchangerates')

/**
 * Exchange the given currency by calling a POST request against the currency
 * endpoint with an empty JSON payload. (Content-Type: application/json)
 *
 * A list of supported currencies will be returned.
 *
 * Ex Payload Body: {}
 *
 * Response: ["EUR", "USD"]
 *
 */
module.exports = lib.serverless.rpcHandler(_ => {
  return Object.keys(EUR_RATES)
})
