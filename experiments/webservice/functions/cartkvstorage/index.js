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

function addItem (userID, itemID, quantity) {
  if (itemID.includes('-|-|-|-') || userID.includes('-|-|-|-')) {
    return { error: 'Congratulations. You found a hidden error message.' }
  }
  if (!items.has(userID)) {
    items.set(userID, [itemID])
    quantities.set(userID + '-|-|-|-' + itemID, quantity)
  } else if (!items.get(userID).includes(itemID)) {
    items.get(userID).push(itemID)
    quantities.set(userID + '-|-|-|-' + itemID, quantity)
  } else {
    quantities.set(
      userID + '-|-|-|-' + itemID,
      quantities.get(userID + '-|-|-|-' + itemID) + quantity
    )
  }
  return {}
}

function getCart (userID) {
  const tmp = []
  items.get(userID).forEach(item =>
    tmp.push({
      productID: item,
      quantity: quantities.get(userID + '-|-|-|-' + item)
    })
  )
  return { items: tmp }
}

function emptyCart (userID) {
  for (const item in items.get(userID)) {
    quantities.delete(userID + '-|-|-|-' + item)
  }
  items.delete(userID)
  return {}
}

module.exports = lib.serverless.rpcHandler(event => {
  const operation = event.operation.toLowerCase()
  if (operation !== 'add' && operation !== 'get' && operation !== 'empty') {
    return { error: 'Invalid operation.' }
  }
  const userID = event.userID
  if (!userID) {
    return { error: 'A non-empty user ID has to be specified.' }
  }

  switch (operation) {
    case 'add':
      return addItem(userID, event.itemID, event.quantity)
    case 'get':
      return getCart(userID)
    case 'empty':
      return emptyCart(userID)
  }
})
