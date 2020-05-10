const Router = require('@koa/router')
const router = new Router()

module.exports = router

router.get('/', (ctx, next) => {
  ctx.body = { message: 'Hello World from test2!' }
})
