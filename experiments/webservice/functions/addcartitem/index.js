const lib = require('@faastermetrics/lib')

/**
 *
 * Adds a new item to a users cart.
 *
 * Example Payload: {
 *   "userID": "USER12",
 *   "item": {
 *     "productID": "QWERTY",
 *     "quantity": 2
 *   }
 * }
 *
 * Example Response: { }
 *
 */

module.exports = lib.serverless.rpcHandler(async (event, ctx) => {
  if (!event.userID || !event.item) {
    return { error: 'Wrong input format.' }
  }
  if (!event.item.productID || !event.item.quantity) {
    return { error: 'There is no item to be added.' }
  }
  return await ctx.call('cartkvstorage', {
    operation: 'add',
    userID: event.userID,
    itemID: event.item.productID,
    quantity: event.item.quantity
  })
})
