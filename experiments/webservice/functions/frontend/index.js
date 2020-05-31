const lib = require('@faastermetrics/lib')

const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const homeHTML = _.template(
  fs.readFileSync(path.join(__dirname, 'html_templates', 'home.html'))
)

module.exports = lib.serverless.router(async router => {
  router.get('/', async (ctx, next) => {
    const sessionID = lib.helper.generateRandomID()
    let chosenCurrency = 'USD'
    const supportedCurrencies = (await ctx.lib.call('supportedcurrencies', '{}')).currencyCodes
    const productList = (await ctx.lib.call('listproducts', '{}')).products
    await console.log(productList)
    await console.log(supportedCurrencies)

    const options = {
      session_id: sessionID,
      user_currency: chosenCurrency,
      currencies: supportedCurrencies, 
      products: productList,
      cart_size: 1,
      banner_color: 'white', // illustrates canary deployments
      ad: {
        redirect_url: 'https://duckduckgo.com',
        text: 'AD4U!',
        picture_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tabby_cat_with_blue_eyes-3336579.jpg/499px-Tabby_cat_with_blue_eyes-3336579.jpg'
      }
    }
    ctx.type = 'text/html'
    ctx.body = homeHTML(options)
  })

  /*
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
  */
})
