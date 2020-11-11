const lib = require('@befaas/lib')

/**
 *
 * Returns a users cart.
 *
 * Example Payload: {
 *   "userId": "USER12"
 * }
 *
 * Example Response: {
 *   "userId": "USER12",
 *   "items": [{
 *     "productId": "QWERTY",
 *     "quantity": 7
 *   }]
 * }
 *
 */

module.exports = lib.serverless.rpcHandler(async (event, ctx) => {
  if (!event.userId) {
    return { error: 'Wrong input format.' }
  }
  const cart = await ctx.call('cartkvstorage', {
    operation: 'get',
    userId: event.userId
  })
  return {
    userId: event.userId,
    items: cart.items
  }
})
