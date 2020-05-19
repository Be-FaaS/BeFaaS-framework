const lib = require('@faastermetrics/lib')

module.exports = lib.serverless.rpcHandler(event => {
  return { result: 'test new azure' }
})
