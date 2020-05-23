module.exports = {
  beforeRequest: beforeRequest,
  afterResponse: afterResponse
}

function getRandomID () {
  var out = ''
  for (var i = 0; i < 32; i++) {
    out += Math.floor(Math.random() * 10)
  }
  return out
}

// This is a workaround to artillery not resolving variables before the beforeRequest callback
// this results in the url field being {{ functionName }} instead of the actual url
function resolveVar (url, context) {
  var regex = /{{ \w+ }}/g
  var match = url.match(regex)[0]
  var varname = match.match(/\w+/g)[0]
  return url.replace(match, context.vars[varname])
}

function beforeRequest (requestParams, context, ee, next) {
  var url = resolveVar(requestParams.url, context)
  console.log(context.vars.blubb)
  var d = new Date()
  var id = getRandomID()
  requestParams.headers.artillery_uid = id
  console.log(`${id} ${d.getTime()} before ${url}`)

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
