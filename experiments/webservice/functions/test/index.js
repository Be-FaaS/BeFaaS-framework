const lib = require('@faastermetrics/lib')

module.exports = lib.serverless.router(router => {
  router.get('/', (ctx, next) => {
    ctx.body = { message: 'Hello World from test!' }
  })

  router.get('/call/:provider', async (ctx, next) => {
    ctx.body = await lib.call(ctx.params.provider, 'test2')
  })

  router.attachEventHandler(event => {
    lib.log({ event })
    return { ok: true, from: 'test' }
  })
})
