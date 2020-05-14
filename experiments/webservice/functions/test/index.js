const lib = require('../../lib/')

lib.log({ coldstart: true })

module.exports = lib.serverless(router => {
  router.get('/', (ctx, next) => {
    lib.log(ctx.request)
    ctx.body = { message: 'Hello World from test!' }
  })

  router.get('/call/:provider', async (ctx, next) => {
    ctx.body = await lib.call(ctx.params.provider, 'test2')
  })

  router.post('/call', async (ctx, next) => {
    lib.log(ctx.request.body)
    ctx.body = { ok: true, from: 'test' }
  })
})
