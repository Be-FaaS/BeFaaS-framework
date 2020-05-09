// const AWS = require('aws-sdk')
const Router = require('@koa/router')
const router = new Router({
  prefix: process.env.AWS_LAMBDA_FUNCTION_NAME && '/:fn'
})

module.exports = router

router.get('/', (ctx, next) => {
  ctx.body = { message: 'Hello World from test!' }
})

router.get('/logs', async (ctx, next) => {
  for (var i = 0; i < 10000; i++) {
    console.log(JSON.stringify({
      id: i,
      ts: (new Date()).getTime()
    }))
  }
  ctx.body = { done: true }
})
