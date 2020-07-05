const lib = require('@faastermetrics/lib')
const _ = require('lodash')

/**
 *
 * Store counts of detected objects in the scene with a current timestamp.
 *
 * Example Payload: {
 *   "objects": [{
 *     "type": "ambulance",
 *     "positionx": 0,
 *     "positiony": 0,
 *     "boundx": 3,
 *     "boundy": 2
 *   }]
 * }
 *
 * Example Response: {
 *  "ambulance": 1,
 *  "car": 10
 * }
 *
 */

module.exports = lib.serverless.rpcHandler(async (event, ctx) => {
  const { objects } = event
  if (!Array.isArray(objects)) return { error: 'Wrong payload.' }

  const statistics = _.countBy(objects, 'type')
  const timestamp = new Date().toISOString()
  await ctx.db.set(timestamp, statistics)

  return statistics
})
