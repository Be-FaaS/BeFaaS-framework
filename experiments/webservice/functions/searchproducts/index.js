const lib = require('@faastermetrics/lib')
const { products } = require('../../productcatalog/products')

/**
 *
 * Searches the product catalog for a given product.
 *
 * Example Request: {
 *  "query": "BATHING"
 * }
 *
 * Example Response: {
 *   "results": [{
 *     "id": "QWERTY",
 *     "name": "Bathing Suit",
 *     "description": "You will never want to take this off!",
 *     "picture": "bathing_suit.jpg",
 *     "priceUsd": {
 *       "currencyCode": "USD",
 *       "units": 64,
 *       "nanos": 990000000
 *     },
 *     "categories": ["clothing", "bath"]
 *   }]
 * }
 *
 */

module.exports = lib.serverless.rpcHandler(event => {
  const query = event.query.toLowerCase()
  const results = []
  for (const key in products) {
    if (
      key.toLowerCase().includes(query) ||
      products[key].name.toLowerCase().includes(query) ||
      products[key].description.toLowerCase().includes(query)
    ) {
      results.push(products[key])
    }
  }
  return { results: results }
})
