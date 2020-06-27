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

module.exports = lib.serverless.rpcHandler(event => {
  const objects = event.objects
  if (! Array.isArray(objects)) return { error: 'Wrong payload.' }

  const emergencies = ['ambulance', 'police', 'lunatic']
  for (const key of emergencies) {
    if (_.filter(objects, { type: key }).length > 0) {
      return { emergency: { active: true, type: key }}
    }
  }

  return { emergency: { active: false, type: '' }}
})
