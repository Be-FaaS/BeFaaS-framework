const lib = require('@faastermetrics/lib')

/**
 *
 * Serves as an internal key-value storage.
 *
 * Example Request (add): {
 *   "operation": "add",
 *   "userID": "UID6",
 *   "itemID": "QWERTY"
 * }
 *
 * Example Request (get): {
 *   "operation": "get",
 *   "userID": "UID6"
 * }
 *
 * Example Request (empty): {
 *   "operation": "empty",
 *   "userID": "UID6"
 * }
 *
 * Example Response (add): { }
 *
 * Example Response (get): {
 *   "cart": ["QWERTY"]
 * }
 *
 * Example Response (empty): { }
 *
 */

const carts = new Map()

module.exports = lib.serverless.rpcHandler(event => {
  const operation = event.operation.toLowerCase()
  if (operation !== 'add' && operation !== 'get' && operation !== 'empty') {
    return { error: 'Invalid operation.' }
  }
  const userID = event.userID
  if (userID === undefined) {
    return { error: 'A user ID has to be specified.' }
  }

  switch (operation) {
    case 'add':
      if (event.itemID === undefined) {
        return { error: 'There is no item to be added.' }
      }
      if (!carts.has(userID)) {
        carts.set(userID, [event.itemID])
      } else {
        carts.set(userID, carts.get(userID).push(event.itemID))
      }
      return {}
    case 'get':
      return { cart: carts.get(userID) }
    case 'empty':
      carts.delete(userID)
      return {}
  }
})
