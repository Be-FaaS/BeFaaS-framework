const lib = require('@faastermetrics/lib')

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

// Maps userId --> itemId
const items = new Map()
// Maps userId x itemId --> quantity
const quantities = new Map()

function addItem (userId, itemId, quantity) {
  if (itemId.includes('-|-|-|-') || userId.includes('-|-|-|-')) {
    return { error: 'Congratulations. You found a hidden error message.' }
  }
  if (!items.has(userId)) {
    items.set(userId, [itemId])
    quantities.set(userId + '-|-|-|-' + itemId, quantity)
  } else if (!items.get(userId).includes(itemId)) {
    items.get(userId).push(itemId)
    quantities.set(userId + '-|-|-|-' + itemId, quantity)
  } else {
    quantities.set(
      userId + '-|-|-|-' + itemId,
      quantities.get(userId + '-|-|-|-' + itemId) + quantity
    )
  }
  return {}
}

function getCart (userId) {
  if (!items.has(userId)) {
    return { items: [] }
  }
  const tmp = []
  items.get(userId).forEach(item =>
    tmp.push({
      productId: item,
      quantity: quantities.get(userId + '-|-|-|-' + item)
    })
  )
  return { items: tmp }
}

function emptyCart (userId) {
  if (!items.has(userId)) {
    return {}
  }
  for (const item in items.get(userId)) {
    quantities.delete(userId + '-|-|-|-' + item)
  }
  items.delete(userId)
  return {}
}

module.exports = lib.serverless.rpcHandler({ db: 'redis' }, event => {
  const operation = event.operation.toLowerCase()
  if (operation !== 'add' && operation !== 'get' && operation !== 'empty') {
    return { error: 'Invalid operation.' }
  }
  const userId = event.userId
  if (!userId) {
    return { error: 'A non-empty user ID has to be specified.' }
  }

  switch (operation) {
    case 'add':
      return addItem(userId, event.itemId, event.quantity)
    case 'get':
      return getCart(userId)
    case 'empty':
      return emptyCart(userId)
  }
})
