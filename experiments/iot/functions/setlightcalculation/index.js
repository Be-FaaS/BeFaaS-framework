const lib = require('@faastermetrics/lib')
const _ = require('lodash')

/**
 *
 * Responsible for current traffic light calculation. 
 * Adapts to results of movement plan, emergency detection and road condition.
 * Writes light into database.
 *
 * Example Request (add): {
 *   "plan": [{
 *     "plate": "XXX"
 *     "direction": 3
 *     "speed": 63.8
 *   }]
 * 
 *   "emergency": {
 *     "active": true
 *     "type": "lunatic"
 *   }
 * 
 *   "condition": 5
 * }
 *
 * Example Response (empty): { }
 *
 */

function initialDBUpdate (ctx, condition, plan, emergency) {
  if (condition) ctx.db.set('lightcalculation:condition', _.toString(condition))

  if (plan) {
    ctx.db.set('lightcalculation:plates', _.map(plan, 'plate'))
    ctx.db.set('lightcalculation:directions', _.map(_.map(plan, 'direction'), _.toString))
    ctx.db.set('lightcalculation:speeds', _.map(_.map(plan, 'speed'), _.toString))
  }

  // Active emergencies are handled immediately
  if (emergency) {
    if (emergency.active) {
      ctx.db.set('lightcalculation:light', ['yellow'])
      ctx.db.set('lightcalculation:blink', 'true')
      ctx.db.set('lightcalculation:emergency', 'true')
      ctx.db.set('lightcalculation:emergencytype', emergency.type)
    }
    else {
      ctx.db.set('lightcalculation:emergency', 'false')
      ctx.db.set('lightcalculation:emergencytype', '')
    }
  }
}

function checkAndLock (ctx) {
  if ((ctx.db.get('lightcalculation:lock')) === 'true') return true
  ctx.db.set('lightcalculation:lock', 'true')
  return false
}

function checkAndUnlock (ctx) {
  if ((ctx.db.get('lightcalculation:lock')) === 'false') return true
  ctx.db.set('lightcalculation:lock', 'false')
  return false
}

async function wait(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

async function waitAppropriately (ctx) {
  const condition = await _.toInteger(ctx.db.get('lightcalculation:condition'))
  return new Promise(resolve => setTimeout(resolve, (condition + 2.5) * 1000));
}

function changeLight (ctx) {
  // Emergencies rule
  const emergency = (ctx.db.get('lightcalculation:emergency') === 'true')
  if (emergency) {
    ctx.db.set('lightcalculation:light', ['yellow'])
    ctx.db.set('lightcalculation:blink', 'true')
    return
  }

  // If no movement plan or cars just say lights are red blink (so pedestrians are happy)
  const plates = ctx.db.get('lightcalculation:plates')
  //const directions = ctx.db.get('lightcalculation:directions')
  // We probably really should have 4 different traffic lights
  const speeds = ctx.db.get('lightcalculation:speeds')
  if (_.isEmpty(plates) || ! _.find(_.map(speeds, _.toFinite)), x => x > 50) {
    ctx.db.set('lightcalculation:light', ['yellow'])
    ctx.db.set('lightcalculation:blink', 'false')
    wait(1)
    ctx.db.set('lightcalculation:light', ['red'])
    ctx.db.set('lightcalculation:blink', 'false')
  }
  else {
    ctx.db.set('lightcalculation:light', ['yellow', 'red'])
    ctx.db.set('lightcalculation:blink', 'false')
    wait(1)
    ctx.db.set('lightcalculation:light', ['green'])
    ctx.db.set('lightcalculation:blink', 'false')
  }
  
  const new_emergency = (ctx.db.get('lightcalculation:emergency') === 'true')
  if (new_emergency) {
    ctx.db.set('lightcalculation:light', ['yellow'])
    ctx.db.set('lightcalculation:blink', 'true')
    return
  }

}

module.exports = lib.serverless.rpcHandler(
  { db: 'redis' }, (event, ctx) => {
    const { plan, emergency, condition } = event
    if (!plan && !emergency && !condition) return { error: 'Wrong payload.' }

    initialDBUpdate(ctx, condition, plan, emergency)

    if (checkAndLock(ctx)) return { }
    waitAppropriately(ctx)
    if (checkAndUnlock(ctx)) return { }

    changeLight(ctx)
    return { }
  }
)
