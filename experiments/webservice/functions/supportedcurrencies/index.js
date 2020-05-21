const lib = require('@faastermetrics/lib')
const { EUR_RATES } = require('../../currency/exchangerates')

/**
 * Exchange the given currency by calling a POST request against the currency
 * endpoint with an empty JSON payload. (Content-Type: application/json)
 *
 * A dict with list of supported currencies will be returned.
 *
Does not need a payload.
 *
 * Response: {"currencyCodes": ["EUR", "USD"]}
 *
 */
module.exports = lib.serverless.rpcHandler(_ => {
  return { currencyCodes: Object.keys(EUR_RATES) }
})
