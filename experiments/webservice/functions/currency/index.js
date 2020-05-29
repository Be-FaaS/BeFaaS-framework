const lib = require('@faastermetrics/lib')
const { EUR_RATES } = require('../../currency/exchangerates')

function getRate (from, to) {
  return EUR_RATES[to] / EUR_RATES[from]
}

function symmetricFloor (amount) {
  if (amount > 0) {
    return Math.floor(amount)
  } else {
    return Math.ceil(amount)
  }
}

function applyRate (units, nanos, rate) {
  const rawUnits = units * rate
  const newUnits = symmetricFloor(rawUnits)

  const addedNanos = (rawUnits - newUnits) * 1e9
  const newNanos = symmetricFloor(nanos * rate + addedNanos)

  const addedUnits = symmetricFloor(newNanos / 999999999)

  const finalUnits = newUnits + addedUnits
  const finalNanos = symmetricFloor(newNanos % 999999999)

  return [finalUnits, finalNanos]
}

/**
 * Exchange the given currency by calling a POST request against the currency
 * endpoint with a JSON payload. (Content-Type: application/json)
 *
 * Units are the whole units of the given currency. Nanos are 10^-9 units of
 * the given currency, eg 0.5 USD are 500,000,000 Nanos.
 *
 * Ex Payload Body: {
 *   from: {
 *   "units": 100,
 *   "nanos": 500000000,
 *   "currencyCode": "PHP"
 *   },
 *   "toCode": "RUB"
 * }
 *
 * Response: {
 *   "units": 146,
 *   "nanos": 78542481,
 *   "currencyCode": "RUB"
 *
 * }
 */
module.exports = lib.serverless.rpcHandler(event => {
  const { from, toCode } = event
  const rate = getRate(from.currencyCode, toCode)
  const [convUnits, convNanos] = applyRate(from.units, from.nanos, rate)

  // carry over fractions from units
  return { units: convUnits, nanos: convNanos, currencyCode: toCode }
})
