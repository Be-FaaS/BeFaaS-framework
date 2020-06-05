const lib = require('@faastermetrics/lib')
const { performance } = require('perf_hooks')

const LIB_VERSION = require('@faastermetrics/lib/package.json').version

const fnName = 'artillery'

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

function logEvent (event) {
  console.log(
    'FAASTERMETRICS' +
      JSON.stringify({
        version: LIB_VERSION,
        timestamp: new Date().getTime(),
        now: performance.now(),
        fn: {
          id: '',
          name: fnName
        },
        event
      })
  )
}

function beforeRequest (requestParams, context, ee, next) {
  var url = resolveVar(requestParams.url, context)
  var contextId = lib.helper.generateRandomID()
  var xPair = `${contextId}-${lib.helper.generateRandomID()}`
  requestParams.headers['x-context'] = contextId
  requestParams.headers['x-pair'] = xPair
  logEvent({ url, contextId, xPair, type: 'before' })
  return next()
}

function afterResponse (requestParams, response, context, ee, next) {
  logEvent({
    url: requestParams.url,
    contextId: requestParams.headers['x-context'],
    xPair: requestParams.headers['x-pair'],
    type: 'after'
  })
  return next()
}
