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
  await lib.call('cartkvstorage', {
    operation: 'empty',
    userID: event.userID
  })
})
