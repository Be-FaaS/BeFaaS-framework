const lib = require('@befaas/lib')

/*
 * Check that temperature is both valid and a number. Value is in celsius.
 */
function checkTemperature (temperature) {
  if (temperature && !isNaN(temperature)) {
    return temperature >= -273.15 && temperature <= 100.0
  }
  return false
}

/*
 * Check that humidity is both valid and a number. Value is in %.
 */
function checkHumidity (humidity) {
  if (humidity && !isNaN(humidity)) {
    return humidity >= 0.0 && humidity <= 100.0
  }
  return false
}

/*
 * Check that wind is both valid and a number. Value is in m/s.
 */
function checkWind (wind) {
  if (wind && !isNaN(wind)) {
    return wind >= 0.0 && wind <= 150.0
  }
  return false
}

/*
 * Check that rain is a true boolean.
 */
function checkRain (rain) {
  return typeof rain === 'boolean'
}

/*
 * Filters incoming weather sensor data, such as removing erroneous data or NaN
 * values.
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
module.exports = lib.serverless.msgHandler(async (event, ctx) => {
  const { temperature, humidity, wind, rain } = event

  if (!checkTemperature(temperature)) {
    return { error: 'Invalid temperature.' }
  }

  if (!checkHumidity(humidity)) {
    return { error: 'Invalid humidity.' }
  }

  if (!checkWind(wind)) {
    return { error: 'Invalid wind.' }
  }

  if (!checkRain(rain)) {
    return { error: 'Invalid rain.' }
  }
  
  await ctx.call('publisher', {
	fun: 'roadcondition',
	event: { 
	  temperature: temperature,
      humidity: humidity,
      wind: wind,
      rain: rain
	}
  })
  return {}
})
