const lib = require('@befaas/lib')

/**
 *
 * Empties a users cart.
 *
 * Example Payload: {
 *   "userId": "USER12"
 * }
 *
 * Example Response: { }
 *
 */

module.exports = lib.serverless.rpcHandler(async (event, ctx) => {
  if (!event.userId) {
    return { error: 'Wrong input format.' }
  }
  return await ctx.call('cartkvstorage', {
    operation: 'empty',
    userId: event.userId
  })
})
