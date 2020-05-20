const lib = require('@faastermetrics/lib')
const { products } = require('../../productcatalog/products')

/**
 *
 * Searches the product catalog for a given product.
 *
 * Example Request: {
 *  "id": "QWERTY"
 * }
 *
 * Example Response: {
 *   "id": "QWERTY",
 *   "name": "Bathing Suit",
 *   "description": "You will never want to take this off!",
 *   "picture": "bathing_suit.jpg",
 *   "priceUsd": {
 *     "currencyCode": "USD",
 *     "units": 64,
 *     "nanos": 990000000
 *   },
 *   "categories": ["clothing", "bath"]
 * }
 *
 */

module.exports = lib.serverless.rpcHandler(event => {
  const id = event.id
  let product
  for (const key in products) {
    if (products[key].id === id) {
      product = products[key]
    }
  }
  return product
})
