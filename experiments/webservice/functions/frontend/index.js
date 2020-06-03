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

// TODO make this real and user-dependent
let cartSize = 0

function getSessionID (ctx) {
  if (!ctx.cookies.get('sessionId')) {
    ctx.cookies.set('sessionId', lib.helper.generateRandomID())
  }
  return ctx.cookies.get('sessionId')
}

function getUserCurrency (ctx) {
  return ctx.cookies.get('userCurrency') || 'EUR'
}

function getUserName (ctx) {
  return ctx.cookies.get('userName') || 'default'
}

module.exports = lib.serverless.router(async router => {
  router.get('/', async (ctx, next) => {
    const requestId = lib.helper.generateRandomID()
    const supportedCurrencies = (await ctx.lib.call('supportedcurrencies', {})).currencyCodes
    const productList = (await ctx.lib.call('listproducts', {})).products
    const cats = (await ctx.lib.call('getads', {})).ads

    for (product of productList) {
      if (getUserCurrency(ctx) === 'USD') {
        product.price = product.priceUsd
      } else {
        product.price = await ctx.lib.call('currency', {from: product.priceUsd, toCode: getUserCurrency(ctx)})
      }
    }

    const options = {
      session_id: getSessionID(ctx),
      request_id: requestId,
      user_currency: getUserCurrency(ctx),
      currencies: supportedCurrencies, 
      products: productList,
      cart_size: cartSize,
      banner_color: 'white', // illustrates canary deployments
      ads: cats
    }
    ctx.type = 'text/html'
    ctx.body = homeHTML(options)
  })

  router.post('/setCurrency(.*)', async (ctx, next) => {
    ctx.type = 'application/json'
    // chosenCurrency = ctx.request.body.currencyCode
    ctx.cookies.set('userCurrency', ctx.request.body.currencyCode, { overwrite:true })
    ctx.response.redirect('back', '../')
  })

  // TODO make recommendations more meaningful? --> use categories?
  // Yes, IDs are required to be word shaped here
  router.get('/product/([A-Za-z0-9_]+)', async (ctx, next) => {
    const productId = ctx.request.url.split("/").slice(-1)[0]
     
    const requestId = lib.helper.generateRandomID()
    const product = await ctx.lib.call('getproduct', { id: productId })
    // error if product not found
    if (product.error) {
      ctx.type = 'application/json'
      ctx.body = product
      ctx.status = 422
      return
    }

    if (getUserCurrency(ctx) === 'USD') {
      product.price = product.priceUsd
    } else {
      product.price = await ctx.lib.call('currency', {from: product.priceUsd, toCode: getUserCurrency(ctx)})
    }
    const supportedCurrencies = (await ctx.lib.call('supportedcurrencies', {})).currencyCodes
    let recommendedList = (await ctx.lib.call('listrecommendations', { userId: getUserName(ctx), productIds: [productId] })).productIds
    recommendedList = /*await*/ recommendedList.map(x => ctx.lib.call('getproduct', { id: x }))

    const cat = (await ctx.lib.call('getads', {})).ads[0]

    const options = {
      session_id: getSessionID(ctx),
      request_id: requestId,
      product: product,
      user_currency: getUserCurrency(ctx),
      currencies: supportedCurrencies, 
      recommendations: recommendedList,
      cart_size: cartSize,
      ad: cat
    }
    ctx.type = 'text/html'
    ctx.body = productHTML(options)
  })
})
