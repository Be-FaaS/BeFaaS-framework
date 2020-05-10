const lib = require('../../lib/')

module.exports = lib.serverless(router => {
  router.get('/', (ctx, next) => {
    ctx.body = { message: 'Hello World from test2!' }
  })
})
