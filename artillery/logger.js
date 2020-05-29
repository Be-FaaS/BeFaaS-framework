module.exports = {
  beforeRequest: beforeRequest,
  afterResponse: afterResponse,
  beforeScenario: beforeScenario,
  afterScenario: afterScenario
}

function getRandomID () {
  var out = ''
  for (var i = 0; i < 32; i++) {
    out += Math.floor(Math.random() * 10)
  }
  return out
}

var initialized = false
function beforeScenario (context, events, done) {
  if (!initialized) {
    initialized = true
  }
  return done()
}

function afterScenario (context, events, done) {
  return done()
}

function beforeRequest (requestParams, context, ee, next) {
  var d = new Date()
  var id = getRandomID()
  requestParams.headers.artillery_uid = id
  console.log(`${id} ${d.getTime()} before ${requestParams.url}`)

  return next()
}

function afterResponse (requestParams, response, context, ee, next) {
  var d = new Date()

  console.log(
    `${requestParams.headers.artillery_uid} ${d.getTime()} after ${
      requestParams.url
    } ${response.statusCode}`
  )

  return next()
}
