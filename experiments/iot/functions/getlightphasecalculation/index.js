const lib = require('@faastermetrics/lib')

/**
 *
 * Gets current traffic lights from the light calculation database.
 *
 * Example Request (empty): { }
 *
 * Example Response (empty): {
 *   "lights": ["green", "yellow", "red"],
 *   "blink": true
 * }
 *
 */

module.exports = lib.serverless.rpcHandler(
  { db: 'redis' }, async (event, ctx) => {
    const lights = await ctx.db.get('lightcalculation:lights')
    const blink = (await ctx.db.get('lightcalculation:blink')) === 'true'

    return { lights, blink }
  }
)
