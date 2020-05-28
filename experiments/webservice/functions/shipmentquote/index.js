const lib = require('@faastermetrics/lib')

// Iterates over given cart and calculates shipping cost in EUR
function calculateShippingCost (cart) {
  let count = 0
  for (let i = 0; i < cart.length; i++) {
    // Yes, an item may have negative quantity as far as this function is concerned.
    count += cart[i].quantity
  }
  if (count < 0) {
    return 0
  }
  // Yes, overall item quantity increases quadratically in relation to shipping cost.
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
 *   "costUsd": {
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
  if (cart) {
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
