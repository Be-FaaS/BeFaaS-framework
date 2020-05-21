const lib = require('@faastermetrics/lib')
const { EUR_RATES } = require('../../currency/exchangerates')

/**
 * Responds with an array containing all supported currency codes when called by a POST request.
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
