const serverless = require('serverless-http')
const Koa = require('koa')
const Router = require('@koa/router')

module.exports = routerFn => {
  const app = new Koa()
  const router = new Router()

  routerFn(router)

  router.prefix(process.env.AWS_LAMBDA_FUNCTION_NAME ? '/:fn' : '')
  app.use(router.routes())
  app.use(router.allowedMethods())

  return {
    lambdaHandler: serverless(app),
    googleHandler: app.callback()
  }
}
