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
const cartHTML = _.template(
  fs.readFileSync(path.join(__dirname, 'html_templates', 'cart.html'))
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

// TODO use convert function below
async function convertProductPrice (ctx, product) {
  if (getUserCurrency(ctx) === 'USD') {
    product.price = product.priceUsd
  } else {
    product.price = await ctx.lib.call('currency', {from: product.priceUsd, toCode: getUserCurrency(ctx)})
  }
}

async function convertPrice (ctx, priceUsd) {
  if (getUserCurrency(ctx) === 'USD') {
    return priceUsd
  } else {
    return await ctx.lib.call('currency', {from: priceUsd, toCode: getUserCurrency(ctx)})
  }
}

// Should only be used if (a.currencyCode === b.currencyCode)
function addPrice (a, b) {
  const nanos = (a.nanos + b.nanos) % 1e10
  const units = Math.trunc((a.nanos + b.nanos) / 1e10) + a.units + b.units
  return {
    currencyCode: a.currencyCode,
    nanos: nanos,
    units: units
  }
}

function scalePrice (price, scalar) {
  const nanos = (price.nanos * scalar) % 1e10
  const units = Math.trunc((price.nanos * scalar) / 1e10) + (price.units * scalar)
  return {
    currencyCode: price.currencyCode,
    nanos: nanos,
    units: units
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
      await convertProductPrice(ctx, product)    
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

    await convertProductPrice(ctx, product)
    const supportedCurrencies = (await ctx.lib.call('supportedcurrencies', {})).currencyCodes
    const recommendedIds = (await ctx.lib.call('listrecommendations', { userId: getUserName(ctx), productIds: [productId] })).productIds

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

  router.get('/cart', async (ctx, next) => {
    const cart = (await ctx.lib.call('getcart', { userId: getUserName(ctx) }))//.items

    const products = await cart.map(x => ctx.lib.call('getproduct', { id: x.productId }))
    // Adds quantity and accordingly scaled price to each product
    await _.forEach(products, (product, key) => {
      product.quantity = cart[key].quantity
      convertProductPrice(ctx, product)
      product.price = scalePrice(product.price, cart[key].quantity)
    })

      // Should include address in call according to spec
    const shippingCostUsd = (await ctx.lib.call('shipmentquote', { items: cart })).costUsd
    const shippingCost = await convertPrice(ctx, shippingCostUsd)
    const totalCost = await _.reduce(_.map(products, 'price'), addPrice, shippingCost)

    ctx.type = 'text/html'
    ctx.body = cartHTML(options)
  })

})
