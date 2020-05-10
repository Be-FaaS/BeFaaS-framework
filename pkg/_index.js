const serverless = require('serverless-http')
const Koa = require('koa')

const app = new Koa()
const router = require('./')

router.prefix(process.env.AWS_LAMBDA_FUNCTION_NAME ? '/:fn' : '')

app.use(router.routes())
app.use(router.allowedMethods())

module.exports.lambdaHandler = serverless(app)
module.exports.googleHandler = app.callback()
