const lib = require('@befaas/lib')
const _ = require('lodash')

/**
 *
 * Responds with an appropriate list of product recommendations.
 *
 * Example Payload: {
 *   "userId": "USER12",
 *   "productIds": ["QWERTY", "NOTAVAILABLE"]
 * }
 *
 * Example Response: {
 *   "productIds": ["QWERTY"]
 * }
 *
 */

module.exports = lib.serverless.rpcHandler(async (event, ctx) => {
  const requestedIDs = event.productIds
  if (!requestedIDs) {
    return { error: 'Wrong payload.' }
  }
  const availableProducts = (await ctx.call('listproducts', {})).products
  if (availableProducts === undefined) {
    return { error: 'Cannot receive product list.' }
  }
  const suitableCategories = _.reduce(
    _.map(availableProducts, 'categories'),
    _.union
  )
  const suitableProducts = _.filter(
    availableProducts,
    x => !_.isEmpty(_.intersection(x.categories, suitableCategories))
  )
  const suitableIDs = _.shuffle(
    _.difference(_.map(suitableProducts, 'id'), requestedIDs)
  )

  // We always want to have at most 7 recommendations
  return { productIds: _.slice(suitableIDs, 0, 7) }
})
