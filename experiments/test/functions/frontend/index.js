const lib = require('@faastermetrics/lib')

const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const indexHTML = fs.readFileSync(path.join(__dirname, 'index.html'))
const resultHTML = _.template(
  fs.readFileSync(path.join(__dirname, 'result.html'))
)

module.exports = lib.serverless.router(router => {
  router.get('/', (ctx, next) => {
    ctx.type = 'text/html'
    ctx.body = indexHTML
  })

  router.post('/result', async (ctx, next) => {
    ctx.type = 'text/html'
    const calc = _.mapValues(ctx.request.body, _.parseInt)
    if (!_.isNumber(calc.a) || !_.isNumber(calc.b)) {
      ctx.body = resultHTML({ result: 'invalid calculation' })
      return
    }
    const res = await ctx.lib.call('add', _.pick(calc, ['a', 'b']))
    ctx.body = resultHTML({ result: `${calc.a} + ${calc.b} = ${res.result}` })
  })
})

