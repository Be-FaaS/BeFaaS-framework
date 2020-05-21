const lib = require('@faastermetrics/lib')
const { EUR_RATES } = require('../../currency/exchangerates')

/**
 *
 * A dict with list of supported currency codes will be returned when called by a POST request.
 *
 * Does not need a payload.
 *
 * Response: {"currencyCodes": ["EUR", "USD"]}
 *
 */
module.exports = lib.serverless.rpcHandler(_ => {
  return { currencyCodes: Object.keys(EUR_RATES) }
})
