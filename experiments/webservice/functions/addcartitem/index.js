const lib = require('@faastermetrics/lib')

/**
 *
 * Adds a new item to a users cart.
 *
 * Example Payload: {
 *   "userId": "USER12",
 *   "item": {
 *     "productId": "QWERTY",
 *     "quantity": 2
 *   }
 * }
 *
 * Example Response: { }
 *
 */

module.exports = lib.serverless.rpcHandler(async (event, ctx) => {
  if (!event.userId || !event.item) {
    return { error: 'Wrong input format.' }
  }
  if (!event.item.productId || !event.item.quantity) {
    return { error: 'There is no item to be added.' }
  }
  return await ctx.call('cartkvstorage', {
    operation: 'add',
    userId: event.userId,
    itemId: event.item.productId,
    quantity: event.item.quantity
  })
})
