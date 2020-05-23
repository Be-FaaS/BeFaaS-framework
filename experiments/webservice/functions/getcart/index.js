const lib = require('@faastermetrics/lib')

/**
 *
 * Returns a users cart.
 *
 * Example Payload: {
 *   "userID": "USER12"
 * }
 *
 * Example Response: {
 *   "userID": "USER12",
 *   "items": [{
 *     "productID": "QWERTY",
 *     "quantity": 7
 *   }]
 * }
 *
 */

module.exports = lib.serverless.rpcHandler(async event => {
  if (event.userID === undefined) {
    return { error: 'Wrong input format.' }
  }
  const cartItems = await lib.call('cartkvstorage', {
    operation: 'get',
    userID: event.userID
  })

  return {
    userID: event.userID,
    items: cartItems
  }
})
