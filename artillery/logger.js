const lib = require('@faastermetrics/lib')
const { performance } = require('perf_hooks')

const LIB_VERSION = require('@faastermetrics/lib/package.json').version
const deploymentId =
  process.env.FAASTERMETRICS_DEPLOYMENT_ID || 'unknownDeploymentId'

const fnName = 'artillery'

// This is a workaround to artillery not resolving variables before the beforeRequest callback
// this results in the url field being {{ functionName }} instead of the actual url
function resolveVar (url, context) {
  const regex = /{{ \w+ }}/g
  const match = url.match(regex)[0]
  const varname = match.match(/\w+/g)[0]
  return url.replace(match, context.vars[varname])
}

function logEvent (event) {
  console.log(
    'FAASTERMETRICS' +
      JSON.stringify({
        version: LIB_VERSION,
        deploymentId,
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
  const url = resolveVar(requestParams.url, context)
  const contextId = lib.helper.generateRandomID()
  const xPair = `${contextId}-${lib.helper.generateRandomID()}`
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

module.exports = {
  beforeRequest,
  afterResponse
}
