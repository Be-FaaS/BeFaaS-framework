const lib = require('@faastermetrics/lib')

/**
 *
 * Empties a users cart.
 *
 * Example Payload: {
 *   "userID": "USER12"
 * }
 *
 * Example Response: { }
 *
 */

module.exports = lib.serverless.rpcHandler(async event => {
  if (event.userID === undefined) {
    return { error: 'Wrong input format.' }
  }
  await lib.call(
    'cartkvstorage',
    'ws:emptycart:' +
      Math.random()
        .toString(36)
        .substr(2),
    {
      operation: 'empty',
      userID: event.userID
    }
  )
})
