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

module.exports = lib.serverless.rpcHandler(async (event, ctx) => {
  if (!event.userID) {
    return { error: 'Wrong input format.' }
  }
  const cart = await ctx.call('cartkvstorage', {
    operation: 'get',
    userID: event.userID
  })
  return {
    userID: event.userID,
    items: cart.items
  }
})
