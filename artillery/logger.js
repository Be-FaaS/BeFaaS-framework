const lib = require('@befaas/lib')
const fs = require('fs')
const path = require('path')
const { performance } = require('perf_hooks')


const LIB_VERSION = require('@faastermetrics/lib/package.json').version
const deploymentId =
  process.env.BEFAAS_DEPLOYMENT_ID || 'unknownDeploymentId'

const fnName = 'artillery'

// This is a workaround to artillery not resolving variables before the beforeRequest callback
// this results in the url field being {{ functionName }} instead of the actual url
function resolveVar(url, context) {
  const regex = /{{\s*\w+\s*}}/gm
  const match = url.match(regex)
  if (!match) return url
  for (var i = 0; i < match.length; i++) {
    const varname = match[i].match(/\w+/gm)
    url = url.replace(match[i], context.vars[varname])
  }
  return url
}

function logEvent(event) {
  console.log(
    'BEFAAS' +
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

function beforeRequest(requestParams, context, ee, next) {
  const url = resolveVar(requestParams.url, context)
  const contextId = lib.helper.generateRandomID()
  const xPair = `${contextId}-${lib.helper.generateRandomID()}`
  requestParams.headers['x-context'] = contextId
  requestParams.headers['x-pair'] = xPair
  logEvent({ url, contextId, xPair, type: 'before' })
  return next()
}

function afterResponse(requestParams, response, context, ee, next) {
  logEvent({
    url: requestParams.url,
    contextId: requestParams.headers['x-context'],
    xPair: requestParams.headers['x-pair'],
    type: 'after'
  })

  return next()
}


const timestamp = Math.round(Date.now() / 1000);

function emergencyNever(requestParams, context, ee, next) {
  requestParams.formData.image = fs.createReadStream(path.resolve(__dirname, 'image-noambulance.jpg'))
  return beforeRequest(requestParams, context, ee, next);
}


function singleEmergency(requestParams, context, ee, next) {
  const now = Math.round(Date.now() / 1000);
  if (now - timestamp > 300) { // after 5 minutes (10 seconds before end of workload) send in ambulance
    requestParams.formData.image = fs.createReadStream(path.resolve(__dirname, 'image-ambulance.jpg'))
  } else {
    requestParams.formData.image = fs.createReadStream(path.resolve(__dirname, 'image-noambulance.jpg'))
  }
  return beforeRequest(requestParams, context, ee, next);
}

function emergencyEveryTwoMinutesFiveSecondsEach(requestParams, context, ee, next) {
  const now = Math.round(Date.now() / 1000);
  if (((now - timestamp) % 120) < 5) {
    requestParams.formData.image = fs.createReadStream(path.resolve(__dirname, 'image-ambulance.jpg'))
  } else {
    requestParams.formData.image = fs.createReadStream(path.resolve(__dirname, 'image-noambulance.jpg'))
  }

  return beforeRequest(requestParams, context, ee, next);
}

module.exports = {
  beforeRequest,
  afterResponse,
  singleEmergency,
  emergencyEveryTwoMinutesFiveSecondsEach,
  emergencyNever
}
