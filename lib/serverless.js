const serverless = require('serverless-http')
const Koa = require('koa')

const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')

async function handleErrors (ctx, next) {
  try {
    await next()
  } catch (e) {
    ctx.body = { error: e.toString() }
    ctx.status = 502
  }
}

module.exports = routerFn => {
  const app = new Koa()
  const router = new Router({
    prefix: process.env.AWS_LAMBDA_FUNCTION_NAME && '/:fn'
  })

  router.use(logger(), handleErrors, bodyParser())
  routerFn(router)

  app.use(router.routes())
  app.use(router.allowedMethods())

  return {
    lambdaHandler: serverless(app),
    googleHandler: app.callback()
  }
}
