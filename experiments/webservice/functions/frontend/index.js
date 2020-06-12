const lib = require('@faastermetrics/lib')

const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const templates = {
  home: _.template(
    fs.readFileSync(path.join(__dirname, 'html_templates', 'home.html'))
  ),
  product: _.template(
    fs.readFileSync(path.join(__dirname, 'html_templates', 'product.html'))
  ),
  cart: _.template(
    fs.readFileSync(path.join(__dirname, 'html_templates', 'cart.html'))
  ),
  order: _.template(
    fs.readFileSync(path.join(__dirname, 'html_templates', 'order.html'))
  )
}

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
  return ctx.cookies.get('userName') || ''
}

function getCartSize (ctx) {
  return _.parseInt(ctx.cookies.get('cartSize')) || 0
}

function increaseCartSize (ctx, inc) {
  ctx.cookies.set('cartSize', getCartSize(ctx) + inc, { overwrite: true })
}

function emptyCartSize (ctx) {
  ctx.cookies.set('cartSize', 0, { overwrite: true })
}

async function convertPrice (ctx, priceUsd) {
  if (getUserCurrency(ctx) === 'USD') {
    return priceUsd
  }
  return ctx.lib.call('currency', {
    from: priceUsd,
    toCode: getUserCurrency(ctx)
  })
}

// Should only be used if (a.currencyCode === b.currencyCode)
function addPrice (a, b) {
  const nanos = (a.nanos + b.nanos) % 1e9
  const units = Math.trunc((a.nanos + b.nanos) / 1e9) + a.units + b.units
  return {
    currencyCode: a.currencyCode,
    nanos: nanos,
    units: units
  }
}

function scalePrice (price, scalar) {
  const nanos = (price.nanos * scalar) % 1e9
  const units = Math.trunc((price.nanos * scalar) / 1e9) + price.units * scalar
  return {
    currencyCode: price.currencyCode,
    nanos: nanos,
    units: units
  }
}

function printPrice (price) {
  return (
    _.toString(price.units) +
    '.' +
    _.toString(price.nanos).substr(0, 2) +
    ' ' +
    price.currencyCode
  )
}

module.exports = lib.serverless.router(async router => {
  router.get('/', async (ctx, next) => {
    const requestId = lib.helper.generateRandomID()
    const [supportedCurrencies, productList, cats] = await Promise.all([
      ctx.lib.call('supportedcurrencies', {}),
      ctx.lib.call('listproducts', {}),
      ctx.lib.call('getads', {})
    ])

    const products = await Promise.all(
      productList.products.map(async p =>
        Object.assign({ price: await convertPrice(ctx, p.priceUsd) }, p)
      )
    )

    const options = {
      session_id: getSessionID(ctx),
      request_id: requestId,
      user_id: getUserName(ctx),
      user_currency: getUserCurrency(ctx),
      currencies: supportedCurrencies.currencyCodes,
      products,
      cart_size: getCartSize(ctx),
      banner_color: 'white', // illustrates canary deployments
      ads: cats.ads
    }
    ctx.type = 'text/html'
    ctx.body = templates.home(options)
  })

  // TODO make recommendations more meaningful? --> use categories?
  // Yes, IDs are required to be word shaped here
  router.get('/product/:productId', async (ctx, next) => {
    const productId = ctx.params.productId

    const requestId = lib.helper.generateRandomID()
    const product = await ctx.lib.call('getproduct', { id: productId })
    // error if product not found
    if (product.error) {
      ctx.type = 'application/json'
      ctx.body = product
      ctx.status = 422
      return
    }

    const [price, supportedCurrencies, recommendedIds, cat] = await Promise.all(
      [
        convertPrice(ctx, product.priceUsd),
        ctx.lib.call('supportedcurrencies', {}),
        ctx.lib.call('listrecommendations', {
          userId: getUserName(ctx),
          productIds: [productId]
        }),
        ctx.lib.call('getads', {})
      ]
    )

    product.price = price

    const options = {
      session_id: getSessionID(ctx),
      request_id: requestId,
      product: product,
      user_id: getUserName(ctx),
      user_currency: getUserCurrency(ctx),
      currencies: supportedCurrencies.currencyCodes,
      recommendations: recommendedIds.productIds,
      cart_size: getCartSize(ctx),
      ad: cat.ads[0]
    }
    ctx.type = 'text/html'
    ctx.body = templates.product(options)
  })

  router.get('/cart', async (ctx, next) => {
    const requestId = lib.helper.generateRandomID()

    const cart =
      (await ctx.lib.call('getcart', { userId: getUserName(ctx) })).items || []
    // cart.push({ productId: 'QWERTY', quantity: 2 })

    const products = await Promise.all(
      cart.map(async i =>
        Object.assign(
          {
            quantity: i.quantity
          },
          await ctx.lib.call('getproduct', { id: i.productId })
        )
      )
    )

    // Adds quantity and accordingly scaled price to each product
    const productsWithPrice = await Promise.all(
      products.map(async p =>
        Object.assign(
          {
            price: scalePrice(await convertPrice(ctx, p.priceUsd), p.quantity)
          },
          p
        )
      )
    )
    // Should actually include address in arg object here according to spec
    const [shippingCostUsd, supportedCurrencies] = await Promise.all([
      ctx.lib.call('shipmentquote', { items: cart }),
      ctx.lib.call('supportedcurrencies', {})
    ])
    const shippingCost = await convertPrice(ctx, shippingCostUsd.costUsd)

    const totalCost = _.reduce(
      _.map(productsWithPrice, 'price'),
      addPrice,
      shippingCost
    )

    const options = {
      session_id: getSessionID(ctx),
      request_id: requestId,
      items: productsWithPrice,
      user_id: getUserName(ctx),
      user_currency: getUserCurrency(ctx),
      currencies: supportedCurrencies.currencyCodes,
      cart_size: getCartSize(ctx),
      shipping_cost: shippingCost,
      total_cost: totalCost,
      credit_card_expiration_years: _.range(
        new Date().getFullYear(),
        new Date().getFullYear() + 10
      )
    }

    ctx.type = 'text/html'
    ctx.body = templates.cart(options)
  })

  router.post('/checkout', async (ctx, next) => {
    emptyCartSize(ctx)
    const requestId = lib.helper.generateRandomID()

    const order = ctx.request.body
    const [supportedCurrencies, checkoutResult] = await Promise.all([
      ctx.lib.call('supportedcurrencies', {}),
      ctx.lib.call('checkout', {
        userId: getUserName(ctx),
        userCurrency: getUserCurrency(ctx),
        address: {
          streetAddress: order.street_address,
          city: order.city,
          state: order.state,
          country: order.country,
          zipCode: _.parseInt(order.zip_code)
        },
        email: order.email,
        creditCard: {
          creditCardNumber: order.credit_card_number,
          creditCardCvv: _.parseInt(order.credit_card_cvv),
          creditCardExpirationYear: _.parseInt(
            order.credit_card_expiration_year
          ),
          creditCardExpirationMonth: _.parseInt(
            order.credit_card_expiration_month
          )
        }
      })
    ])

    const options = {
      session_id: getSessionID(ctx),
      request_id: requestId,
      user_id: getUserName(ctx),
      user_currency: getUserCurrency(ctx),
      currencies: supportedCurrencies.currencyCodes,
      cart_size: 0,
      shipping_cost: printPrice(checkoutResult.order.shippingCost),
      tracking_id: checkoutResult.order.shippingTrackingId,
      total_cost: printPrice(checkoutResult.order.totalCost),
      order_id: checkoutResult.order.orderId
    }

    ctx.type = 'text/html'
    ctx.body = templates.order(options)
  })

  router.post('/setUser', async (ctx, next) => {
    const userName = ctx.request.body.userName
    ctx.cookies.set('userName', userName, { overwrite: true })
    emptyCartSize(ctx)
    ctx.type = 'application/json'
    ctx.response.redirect('back')
  })

  router.post('/logout', async (ctx, next) => {
    ctx.cookies.set('userName', '', { overwrite: true })
    emptyCartSize(ctx)
    ctx.type = 'application/json'
    ctx.response.redirect('back')
  })

  router.post('/logoutAndLeave', async (ctx, next) => {
    ctx.cookies.set('userName', '', { overwrite: true })
    emptyCartSize(ctx)
    ctx.type = 'application/json'
    ctx.response.redirect('./')
  })

  router.post('/setCurrency', async (ctx, next) => {
    ctx.cookies.set('userCurrency', ctx.request.body.currencyCode, {
      overwrite: true
    })
    ctx.type = 'application/json'
    ctx.response.redirect('back')
  })

  router.post('/emptyCart', async (ctx, next) => {
    const userId = getUserName(ctx)
    await ctx.lib.call('emptycart', { userId: userId })
    emptyCartSize(ctx)
    ctx.type = 'application/json'
    ctx.response.redirect('back')
  })

  router.post('/addCartItem', async (ctx, next) => {
    const userName = getUserName(ctx)
    const productId = ctx.request.body.productId
    const quantity = _.parseInt(ctx.request.body.quantity)

    if (userName) {
      await ctx.lib.call('addcartitem', {
        userId: userName,
        item: {
          productId: productId,
          quantity: quantity
        }
      })
      increaseCartSize(ctx, quantity)
    }
    ctx.type = 'application/json'
    ctx.response.redirect('back')
  })
})
