const lib = require('@faastermetrics/lib')

/**
 *
 * Serves as an internal key-value storage.
 *
 * Example Request (add): {
 *   "operation": "add",
 *   "userID": "UID6",
 *   "itemID": "QWERTY",
 *   "quantity": 7
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
 *   "items": [{
 *     "productID": "QWERTY"],
 *     "quantity": 7
 *   }]
 * }
 *
 * Example Response (empty): { }
 *
 */

// Maps userID --> itemID
const items = new Map()
// Maps userID x itemID --> quantity
const quantities = new Map()

module.exports = lib.serverless.rpcHandler(event => {
  const operation = event.operation.toLowerCase()
  if (operation !== 'add' && operation !== 'get' && operation !== 'empty') {
    return { error: 'Invalid operation.' }
  }
  const userID = event.userID
  if (userID === undefined) {
    return { error: 'A user ID has to be specified.' }
  }

  const tmp = []
  switch (operation) {
    case 'add':
      if (event.itemID === undefined || event.quantity === undefined) {
        return { error: 'There is no item to be added.' }
      }
      if (!items.has(userID)) {
        items.set(userID, [event.itemID])
        quantities.set([userID, event.itemID], event.quantity)
      } else if (!(items.get(userID).includes(event.itemID))) {
        items.set(userID, items.get(userID).push(event.itemID))
        quantities.set([userID, event.itemID], event.quantity)
      } else {
        quantities.set([userID, event.itemID], quantities.get([userID, event.itemID]) + event.quantity)
      }
      return {}
    case 'get':
      for (const item in items.get(userID)) {
        tmp.push({
          productID: item,
          quantity: quantities.get([userID, item])
        })
      }
      return {
        items: tmp
      }
    case 'empty':
      for (const item in items.get(userID)) {
        quantities.delete([userID, item])
      }
      items.delete(userID)
      return {}
  }
})
