const lib = require('@faastermetrics/lib')
const _ = require('lodash')

/**
 *
 * Serves as an internal key-value storage.
 *
 * Example Request (add): {
 *   "operation": "add",
 *   "userId": "UID6",
 *   "itemId": "QWERTY",
 *   "quantity": 7
 * }
 *
 * Example Request (get): {
 *   "operation": "get",
 *   "userId": "UID6"
 * }
 *
 * Example Request (empty): {
 *   "operation": "empty",
 *   "userId": "UID6"
 * }
 *
 * Example Response (add): { }
 *
 * Example Response (get): {
 *   "items": [{
 *     "productId": "QWERTY"],
 *     "quantity": 7
 *   }]
 * }
 *
 * Example Response (empty): { }
 *
 */

module.exports = lib.serverless.rpcHandler(
  { db: 'redis' },
  async (event, ctx) => {
    const operation = event.operation.toLowerCase()
    if (!['add', 'get', 'empty'].includes(operation)) {
      return { error: 'Invalid operation.' }
    }
    const userId = event.userId
    if (!userId) {
      return { error: 'A non-empty user ID has to be specified.' }
    }

    if (operation === 'empty') {
      await ctx.db.set(userId, null)
      return {}
    }

    const cartItems = (await ctx.db.get(userId)) || []
    if (operation === 'get') {
      return { items: cartItems }
    }

    if (operation === 'add') {
      if (!_.isString(event.itemId) || !_.isNumber(event.quantity)) {
        return { error: 'itemId or quantity is missing' }
      }
      const pos = _.findIndex(cartItems, ['productId', event.itemId])
      if (pos !== -1) {
        cartItems[pos].quantity += event.quantity
      } else {
        cartItems.push({
          productId: event.itemId,
          quantity: event.quantity
        })
      }
      await ctx.db.set(userId, cartItems)
      return {}
    }

    return {}
  }
)
