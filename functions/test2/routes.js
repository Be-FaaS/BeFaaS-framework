const Router = require('@koa/router')
const router = new Router({
  prefix: process.env.AWS_LAMBDA_FUNCTION_NAME && '/:fn'
})

module.exports = router

router.get('/', (ctx, next) => {
  ctx.body = { message: 'Hello World from test2!' }
})
