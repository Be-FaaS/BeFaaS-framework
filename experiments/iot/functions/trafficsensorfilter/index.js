const lib = require('@befaas/lib')

/*
 * Filters incoming traffic sensor data, such as removing erroneous data or NaN
 * values.
 *
  Ex Payload Body: {
    "carDirection": {
      "plate": "OD DI 98231"
      "direction": 4
      "speed": 1.7
    }
  }
 *
 * Response: { } or {
 *   "carDirection": {
 *     "plate": "OD DI 98231"
 *     "direction": 4
 *     "speed": 1.7
 *   }
 * }
 */
module.exports = lib.serverless.msgHandler(async (event, ctx) => {
  // console.log("event in trafficsensorfilter: " + JSON.stringify(event));
  // console.log("ctx in trafficsensorfilter: " + JSON.stringify(ctx));

  const { carDirection } = event

  // console.log("carDirection is: " + JSON.stringify(carDirection));

  if (typeof carDirection.direction !== 'number') return {}
  carDirection.direction |= 0
  if (carDirection.direction < 0 || carDirection.direction > 4) return {}

  if (typeof carDirection.plate !== 'string') return {}
  if (!carDirection.plate.match(/^[A-Z]{2} [A-Z]{2} \d{1,7}$/)) return {}

  carDirection.speed = +carDirection.speed
  if (
    carDirection.speed < -20.0 /* 72 km/h backwards */ ||
    carDirection.speed > 38.8889 /* 140km/h forwards */
  )
    return {}

  await ctx.call('publisher', {
	fun: 'movementplan',
	event: { carDirection }
  })
  return {}
})
