const lib = require('@faastermetrics/lib')

const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const homeHTML = _.template(
  fs.readFileSync(path.join(__dirname, 'html_templates', 'home.html'))
)
const productHTML = _.template(
  fs.readFileSync(path.join(__dirname, 'html_templates', 'product.html'))
)

// TODO make these real and user-dependent
let chosenCurrency = 'EUR'
let sessionId = lib.helper.generateRandomID()
let cartSize = 0
let userName = "default"

module.exports = lib.serverless.router(async router => {
  router.get('/', async (ctx, next) => {
    const requestId = lib.helper.generateRandomID()
    const supportedCurrencies = (await ctx.lib.call('supportedcurrencies', {})).currencyCodes
    const productList = (await ctx.lib.call('listproducts', {})).products
    const cats = (await ctx.lib.call('getads', {})).ads

    for (product of productList) {
      if (chosenCurrency === 'USD') {
        product.price = product.priceUsd
      } else {
        product.price = await ctx.lib.call('currency', {from: product.priceUsd, toCode: chosenCurrency})
      }
    }

    const options = {
      session_id: sessionId,
      request_id: requestId,
      user_currency: chosenCurrency,
      currencies: supportedCurrencies, 
      products: productList,
      cart_size: cartSize,
      banner_color: 'white', // illustrates canary deployments
      ads: cats
    }
    ctx.type = 'text/html'
    ctx.body = homeHTML(options)
  })

  router.post('/setCurrency', async (ctx, next) => {
    chosenCurrency = ctx.request.body
  })

  // TODO make recommendations more meaningful? --> use categories?
  router.post('/product', async (ctx, next) => {
    const requestId = lib.helper.generateRandomID()
    const product = (await ctx.lib.call('getproduct', ctx.request.body))
    const supportedCurrencies = (await ctx.lib.call('supportedcurrencies', {})).currencyCodes
    const cat = (await ctx.lib.call('getads', {})).ads[0]
    const options = {
      request_id: requestId,
      user_currency: chosenCurrency,
      currencies: supportedCurrencies, 
      recommendations: productList,
      cart_size: cartSize,
      ad: cat
    }
    ctx.type = 'text/html'
    ctx.body = __dirname // productHTML(options)
  })

})
