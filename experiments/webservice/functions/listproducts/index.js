const lib = require('@befaas/lib')
const { products } = require('../../productcatalog/products')

/**
 *
 * Responds with a list of all known products.
 *
 * Does not need a payload.
 *
 * Example Response: {
 *   "products": [{
 *     "bathing_suit": {
 *       "id": "QWERTY",
 *       "name": "Bathing Suit",
 *       "description": "You will never want to take this off!",
 *       "picture": "bathing_suit.jpg",
 *       "priceUsd": {
 *         "currencyCode": "USD",
 *         "units": 64,
 *         "nanos": 990000000
 *       },
 *       "categories": ["clothing", "bath"]
 *     }
 *   }]
 * }
 *
 */

module.exports = lib.serverless.rpcHandler(event => {
  // const { address, cart } = event
  const productArray = []
  for (const key in products) {
    productArray.push(products[key])
  }
  return { products: productArray }
})
