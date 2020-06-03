const lib = require('@faastermetrics/lib')

module.exports = lib.serverless.rpcHandler((event, ctx) => {
  ctx.log({ event })
  return { result: event.a + event.b }
})
