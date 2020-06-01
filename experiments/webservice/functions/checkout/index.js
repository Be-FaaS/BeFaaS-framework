const lib = require('@faastermetrics/lib')

/**
 *
 * Checkout Service
 *
 * Place a order with your whole cart. This call
 * gets the current shipment service price for the current user
 * cart and initiates payment in the given currency.
 * After successfully completing shipment and payment the user's cart will
 * be cleared. Additionally, a confirmation email listing all used prices
 * will be sent to the customer.
 *
 *
 * Payload Body:
 {
  "userId": "56437829",
  "userCurrency": "PHP",
  "address": {
    "streetAddress": "Schillerstrasse 9",
    "city": "Munich",
    "state": "Bavaria",
    "country": "Germany"
  },
  "email": "mail@foo",
  "creditCard": {
    "creditCardNumber": "123 456 789 000",
    "creditCardCvv": 123,
    "creditCardExpirationYear": 2000,
    "creditCardExpirationMonth": 10
  }
 }
 *
 *
 * Response after the order has been placed: {
 *   "order_id": "123fasd4",
 *   "shipping_tracking_id": "3uwfs",
 *   "shipping_cost": {
 *     "units": 100,
 *     "nanos": 500000000,
 *     "currencyCode": "PHP"
 *   },
 *   "shipping_address": {
 *     "streetAddress": "Schillerstrasse 9",
 *     "city": "Munich",
 *     "state": "Bavaria",
 *     "country": "Germany"
 *   },
 *   "items" : [
 *     {
 *       "item": {
 *         "productId": "1234b",
 *         "quantity": 3
 *       },
 *       "cost": {
 *         {
 *           "units": 100,
 *           "nanos": 500000000,
 *           "currencyCode": "PHP"
 *         }
 *       }
 *     }
 *   ]
 * }
 *
 */
module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  // TODO(lbb): Use right function method
  const cart = await ctx.call('getcart', {
    userId: request.userId
  })
  const totalOrderPrice = {
    currencyCode: request.userCurrency,
    units: 0,
    nanos: 0
  }
  if (!cart.items || cart.items.length === 0) {
    return { error: 'cart is empty' }
  }
  const cartItems = []
  await Promise.all(
    cart.items.map(async item => {
      const product = await ctx.call('getproduct', {
        id: item.productId
      })
      const productPrice = await ctx.call('currency', {
        from: product.priceUsd,
        toCode: request.userCurrency
      })
      cartItems.push({
        item: item,
        cost: productPrice
      })
      totalOrderPrice.units = productPrice.currencyCode
      totalOrderPrice.units += productPrice.units * item.quantity
      totalOrderPrice.nanos += productPrice.nanos * item.quantity
    })
  )

  const costUsd = await ctx.call('shipmentquote', {
    address: request.address,
    items: cart.items
  })

  const convertedShipmentPrice = await ctx.call('currency', {
    from: costUsd,
    toCode: request.userCurrency
  })

  totalOrderPrice.units = convertedShipmentPrice
  totalOrderPrice.units += convertedShipmentPrice.units
  totalOrderPrice.nanos += convertedShipmentPrice.nanos

  const { transactionId } = await ctx.call('payment', {
    creditCard: request.creditCard,
    amount: totalOrderPrice
  })

  if (!transactionId) return { error: 'failed to charge credit card' }

  const { trackingId } = await ctx.call('shiporder', {
    address: request.address,
    items: cart.items
  })
  const orderResult = {
    orderId: 'deadbeef',
    shippingTrackingId: trackingId,
    shippingCost: convertedShipmentPrice,
    shippingAddress: request.address,
    items: cartItems
  }
  await ctx.call('email', {
    email: request.email,
    order: orderResult
  })
  await ctx.call('emptycart', {
    userId: request.userId
  })
  return orderResult
})
