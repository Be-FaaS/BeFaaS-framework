const lib = require('@faastermetrics/lib')
const _ = require('lodash')

/**
 *
 * Tells if there currently is an emergency situation on our street.
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
 *   "emergency": {
 *     "active": true
 *     "type": "ambulance"
 *   }
 * }
 *
 */

module.exports = lib.serverless.rpcHandler((event, ctx) => {
  const { objects } = event
  if (!Array.isArray(objects)) return { error: 'Wrong payload.' }

  const emergencies = ['ambulance', 'police', 'lunatic']

  let emergency = { active: false, type: '' }
  for (const key of emergencies) {
    if (_.filter(objects, { type: key }).length > 0) {
      emergency = { active: true, type: key }
      break
    }
  }
  ctx.call('setlightphasecalculation', { emergency: emergency })
  return { emergency: emergency }
})
