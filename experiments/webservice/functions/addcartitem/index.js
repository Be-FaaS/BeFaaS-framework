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

module.exports = lib.serverless.rpcHandler(async event => {
  if (
    event.userID === undefined ||
    event.item.productID === undefined ||
    event.item.quantity === undefined
  ) {
    return { error: 'Wrong input format.' }
  }
  await lib.call(
    'cartkvstorage',
    'ws:addtocartitem:' +
      Math.random()
        .toString(36)
        .substr(2),
    {
      operation: 'add',
      userID: event.userID,
      itemID: event.item.productID,
      quantity: event.item.quantity
    }
  )
  return {}
})
