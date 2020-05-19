const lib = require('@faastermetrics/lib')

// Iterates over given cart and calculates shipping cost in EUR
function calculateShippingCost (cart) {
  var count = 0
  for (var i = 0; i < cart.length; i++) {
    count += cart[i].quantity
  }
  // Yes, overall item quantity increases quadratically in relation to shipping cost.
  if (count < 0) {
    return 0
  }
  return 4 + Math.ceil(Math.sqrt(count) / 2)
}

/**
 *
 * Calculates shipping cost for the given shipment request.
 *
 *
 * Ex Payload Body: {
 *  "address":{
 *    "streetAddress": "Schillerstrasse 9",
 *    "city": "Munich",
 *    "state": "Bavaria",
 *    "country": "Germany"
 *  },
 *  "items":[
 *    {"id":1,"quantity":6},
 *    {"id":4,"quantity":-1}
 *  ]
 * }
 *
 * Response: {
 *   "costUsd': {
 *     "currencyCode": "USD",
 *     "units": <shipment cost>,
 *     "nanos": 0
 *   }
 * }
 */
module.exports = lib.serverless.rpcHandler(event => {
  // calculates shipping cost
  const cart = event.items
  let shippingCost = 0
  if (cart !== undefined) {
    shippingCost = calculateShippingCost(cart)
  }

  return {
    costUsd: {
      currencyCode: 'USD',
      units: shippingCost,
      nanos: 0
    }
  }
})
