const lib = require('@faastermetrics/lib')

module.exports = lib.serverless.rpcHandler(request => {
  lib.log({ request })
  // TODO(lbb): Use right function method
  const cart = lib.call('google', 'cart', {
    userId: request.userId
  })
  const totalOrderPrice = {
    currencyCode: request.userCurrency,
    units: 0,
    nanos: 0
  }
  const cartItems = []
  cart.items.forEach(item => {
    const product = lib.call('google', 'product_catalog', {
      id: item.productId
    })
    const productPrice = lib.call('google', 'currency', {
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

  const costUsd = lib.call('google', 'ship/quote', {
    address: request.address,
    items: cart.items
  })

  const convertedShipmentPrice = lib.call('google', 'currency', {
    from: costUsd,
    toCode: request.userCurrency
  })

  totalOrderPrice.units = convertedShipmentPrice
  totalOrderPrice.units += convertedShipmentPrice.units
  totalOrderPrice.nanos += convertedShipmentPrice.nanos

  const { transactionId } = lib.call('google', 'payment', {
    creditCard: request.creditCard,
    amount: totalOrderPrice
  })

  if (!transactionId) return { error: 'failed to charge credit card' }

  const { trackingId } = lib.call('google', 'ship', {
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
  lib.call('google', 'email', {
    email: request.email,
    order: orderResult
  })
  return orderResult
})
