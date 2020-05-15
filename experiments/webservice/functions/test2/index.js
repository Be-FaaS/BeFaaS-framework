const lib = require('@faastermetrics/lib')

lib.log({ coldstart: true })

module.exports = lib.serverless(router => {
  router.get('/', (ctx, next) => {
    lib.log(ctx.request)
    ctx.body = { message: 'Hello World from test2!' }
  })

  router.get('/call/:provider', async (ctx, next) => {
    ctx.body = await lib.call(ctx.params.provider, 'test')
  })

  router.post('/call', async (ctx, next) => {
    lib.log(ctx.request.body)
    ctx.body = { ok: true, from: 'test2' }
  })
})
