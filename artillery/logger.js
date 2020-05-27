const crypto = require('crypto')

module.exports = {
  beforeRequest: beforeRequest,
  afterResponse: afterResponse
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
  var d = new Date()
  var id = crypto.randomBytes(32).toString('hex')
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
