const lib = require('@befaas/lib')

/*
 * Calculate road condition. With 0 being perfect condition and 5 being worst
 * condition.
 */
function calculateRoadCondition (temperature, humidity, wind, rain) {
  let condition = 0
  if (temperature < 4.0) {
    condition += 1
  }

  if (humidity > 75.0) {
    condition += 1
  }

  // beaufort 7
  if (wind > 15.0) {
    condition += 1
  }

  // beaufort 10
  if (wind > 25.0) {
    condition += 1
  }

  if (rain) {
    condition += 1
  }

  return condition
}

/*
 * Calculate road condition and pass to light phase calculation.
 *
 * Ex Payload Body: {
 *    "temperature": 10.0,
 *    "humidity": 50.0,
 *    "wind": 20.0,
 *    "rain": true,
 * }
 *
 * Response: { }
 */
module.exports = lib.serverless.rpcHandler(async (event, ctx) => {
  const { temperature, humidity, wind, rain } = event

  const condition = calculateRoadCondition(temperature, humidity, wind, rain)

  await ctx.call('setlightphasecalculation', {
    condition: condition
  })
  return {}
})
