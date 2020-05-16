const lib = require('@faastermetrics/lib')

module.exports = lib.serverless.event(event => {
  lib.log({ event })
  return { result: event.a + event.b }
})
