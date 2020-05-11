const serverless = require('serverless-http')

const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const stripAnsi = require('strip-ansi')

const log = require('./log')

async function handleErrors (ctx, next) {
  try {
    await next()
  } catch (e) {
    ctx.body = { error: e.toString() }
    ctx.status = 502
  }
}

function hybridBodyParser () {
  const bp = bodyParser()
  return async (ctx, next) => {
    ctx.request.body = ctx.request.body || ctx.req.body
    return bp(ctx, next)
  }
}

module.exports = routerFn => {
  const app = new Koa()
  const router = new Router({
    prefix: process.env.AWS_LAMBDA_FUNCTION_NAME && '/:fn'
  })

  const loggerMW = logger((msg, args) => log({ msg: stripAnsi(msg), args: args.slice(1) }))
  router.use(loggerMW, handleErrors, hybridBodyParser())
  routerFn(router)

  app.use(router.routes())
  app.use(router.allowedMethods())

  return {
    lambdaHandler: serverless(app),
    googleHandler: app.callback()
  }
}
