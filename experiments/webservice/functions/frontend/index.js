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

function getCartSize (ctx) {
  return ctx.cookies.get('cartSize') || 0
}

function increaseCartSize (ctx, inc) {
  ctx.cookies.set('cartSize', getCartSize(ctx) + inc, { overwrite: true })
}

async function convertProductPrize (ctx, product) {
  if (getUserCurrency(ctx) === 'USD') {
    product.price = product.priceUsd
  } else {
    product.price = await ctx.lib.call('currency', {from: product.priceUsd, toCode: getUserCurrency(ctx)})
  }
}

module.exports = lib.serverless.router(async router => {
  router.get('/', async (ctx, next) => {
    const requestId = lib.helper.generateRandomID()
    const supportedCurrencies = (await ctx.lib.call('supportedcurrencies', {})).currencyCodes
    const productList = (await ctx.lib.call('listproducts', {})).products
    const cats = (await ctx.lib.call('getads', {})).ads

    // This one could be parallelised easily
    for (product of productList) {
      await convertProductPrize(ctx, product)    
    }

    const options = {
      session_id: getSessionID(ctx),
      request_id: requestId,
      user_currency: getUserCurrency(ctx),
      currencies: supportedCurrencies, 
      products: productList,
      cart_size: getCartSize(ctx),
      banner_color: 'white', // illustrates canary deployments
      ads: cats,
      href: ctx.request.href
    }
    ctx.type = 'text/html'
    ctx.body = homeHTML(options)
  })

  router.post('/setCurrency', async (ctx, next) => {
    ctx.type = 'application/json'
    // chosenCurrency = ctx.request.body.currencyCode
    ctx.cookies.set('userCurrency', ctx.request.body.currencyCode, { overwrite:true })
    ctx.response.redirect('back', '../')
  })

  // TODO make recommendations more meaningful? --> use categories?
  // Yes, IDs are required to be word shaped here
  router.get('/product/([A-Za-z0-9_]+)', async (ctx, next) => {
    const productId = ctx.request.url.split("/").slice(-1)[0] || ctx.request.url.split("/").slice(-2,-1)[0]
     
    const requestId = lib.helper.generateRandomID()
    const product = await ctx.lib.call('getproduct', { id: productId })
    // error if product not found
    if (product.error) {
      ctx.type = 'application/json'
      ctx.body = product
      ctx.status = 422
      return
    }

    await convertProductPrize(ctx, product)
    const supportedCurrencies = (await ctx.lib.call('supportedcurrencies', {})).currencyCodes
    const recommendedIds = (await ctx.lib.call('listrecommendations', { userId: getUserName(ctx), productIds: [productId] })).productIds
    //const recommendedList = await recommendedIds.map(x => ctx.lib.call('getproduct', { id: x }))

    const cat = (await ctx.lib.call('getads', {})).ads[0]

    const options = {
      session_id: getSessionID(ctx),
      request_id: requestId,
      product: product,
      user_currency: getUserCurrency(ctx),
      currencies: supportedCurrencies, 
      recommendations: recommendedIds,
      cart_size: getCartSize(ctx),
      ad: cat
    }
    ctx.type = 'text/html'
    ctx.body = productHTML(options)
  })

  /*
  router.get('/Cart', async (ctx, next) => {
    let cartItems = (await ctx.lib.call('getCart', { userId: getUserName(ctx) })).items
    cartItems = await cartItems.map(x => ctx.lib.call('getproduct', { id: x })
    const shippingCost = ''
    const totalCost = ''

    ctx.type = 'text/html'
    ctx.body = productHTML(options)
  })
  */

})
