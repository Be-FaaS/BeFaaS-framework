const lib = require('@faastermetrics/lib')
const _ = require('lodash')

/**
 *
 * Responsible for current traffic light calculation.
 * Adapts to results of movement plan, emergency detection and road condition.
 * Writes light into database.
 *
 * Example Request: {
 *   "plan": [{
 *     "plate": "XXX",
 *     "direction": 3,
 *     "speed": 63.8
 *   }],
 *
 *   "emergency": {
 *     "active": true,
 *     "type": "lunatic"
 *   },
 *
 *   "condition": 5
 * }
 *
 * Example Response (empty): { }
 *
 */

async function initialDBUpdate (ctx, condition, plan, emergency) {
  if (typeof condition === 'number')
    await ctx.db.set('lightcalculation:condition', _.toString(condition))

  if (plan) {
    await ctx.db.set('lightcalculation:plates', _.map(plan, 'plate'))
    await ctx.db.set(
      'lightcalculation:directions',
      _.map(_.map(plan, 'direction'), _.toString)
    )
    await ctx.db.set(
      'lightcalculation:speeds',
      _.map(_.map(plan, 'speed'), _.toString)
    )
  }

  // Active emergencies are handled immediately
  if (emergency) {
    if (emergency.active) {
      await ctx.db.set('lightcalculation:lights', ['yellow'])
      await ctx.db.set('lightcalculation:blink', 'true')
      await ctx.db.set('lightcalculation:emergency', 'true')
      await ctx.db.set('lightcalculation:emergencytype', emergency.type)
    } else {
      await ctx.db.set('lightcalculation:emergency', 'false')
      await ctx.db.set('lightcalculation:emergencytype', '')
    }
  }
}

async function checkAndLock (ctx) {
  if ((await ctx.db.get('lightcalculation:lock')) === 'true') return true
  await ctx.db.set('lightcalculation:lock', 'true')
  return false
}

async function checkAndUnlock (ctx) {
  if ((await ctx.db.get('lightcalculation:lock')) === 'false') return true
  await ctx.db.set('lightcalculation:lock', 'false')
  return false
}

async function wait (sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000))
}

async function waitAppropriately (ctx) {
  const condition = await _.toInteger(ctx.db.get('lightcalculation:condition'))
  return new Promise(resolve => setTimeout(resolve, (condition + 2.5) * 1000))
}

async function changeLight (ctx) {
  // Emergencies rule
  const emergency = (await ctx.db.get('lightcalculation:emergency')) === 'true'
  if (emergency) {
    await ctx.db.set('lightcalculation:lights', ['yellow'])
    await ctx.db.set('lightcalculation:blink', 'true')
    return
  }

  // If no movement plan or cars just say lights are red blink (so pedestrians are happy)
  const plates = await ctx.db.get('lightcalculation:plates')
  // const directions = ctx.db.get('lightcalculation:directions')
  // We probably really should have 4 different traffic lights
  const speeds = await ctx.db.get('lightcalculation:speeds')
  if (_.isEmpty(plates) || !_.find(_.map(speeds, _.toFinite), x => x > 50)) {
    await ctx.db.set('lightcalculation:lights', ['yellow'])
    await ctx.db.set('lightcalculation:blink', 'false')
    await wait(2.5)
    await ctx.db.set('lightcalculation:lights', ['red'])
    await ctx.db.set('lightcalculation:blink', 'false')
  } else {
    await ctx.db.set('lightcalculation:lights', ['yellow', 'red'])
    await ctx.db.set('lightcalculation:blink', 'false')
    await wait(2.5)
    await ctx.db.set('lightcalculation:lights', ['green'])
    await ctx.db.set('lightcalculation:blink', 'false')
  }

  const newEmergency =
    (await ctx.db.get('lightcalculation:emergency')) === 'true'
  if (newEmergency) {
    await ctx.db.set('lightcalculation:lights', ['yellow'])
    await ctx.db.set('lightcalculation:blink', 'true')
  }
}

module.exports = lib.serverless.rpcHandler(
  { db: 'redis' },
  async (event, ctx) => {
    const { plan, emergency, condition } = event
    if (!plan && !emergency && typeof condition !== 'number')
      return { error: 'Wrong payload.' }

    await initialDBUpdate(ctx, condition, plan, emergency)

    if (await checkAndLock(ctx)) return {}
    await waitAppropriately(ctx)
    if (await checkAndUnlock(ctx)) return {}

    await changeLight(ctx)
    return {}
  }
)
