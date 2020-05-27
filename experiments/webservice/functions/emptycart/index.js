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

module.exports = lib.serverless.rpcHandler(async (event, ctx) => {
  if (!event.userID) {
    return { error: 'Wrong input format.' }
  }
  return await ctx.call('cartkvstorage', {
    operation: 'empty',
    userID: event.userID
  })
})
