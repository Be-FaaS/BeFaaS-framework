const lib = require('@faastermetrics/lib')

module.exports = lib.serverless.rpcHandler(event => {
  lib.log({ event })
  return { result: event.a + event.b }
})
