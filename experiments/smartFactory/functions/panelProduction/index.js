const lib = require('@befaas/lib')

function produce (priority, type) {
  return new Promise(resolve => {
    var base = 1.0
    switch (type) {
      case 'walnut':
        base = 1.1
        break
      case 'oak':
        base = 1.2
        break
      case 'beech':
        base = 1.3
        break
      case 'birch':
        base = 0.9
        break
      default:
        base = 1.0
    }
    var ms = priority * base * 500
    // console.log(`production will take ${ms} ms`)
    setTimeout(resolve, ms)
  })
}

module.exports = lib.serverless.msgHandler(async (event, ctx) => {
  // console.log('event: ' + JSON.stringify(event))
  // console.log('ctx: ' + JSON.stringify(ctx))

  // Parse Event
  const {
    order,
    length,
    height,
    width,
    type,
    tag,
    priority,
    pricePerUnit
  } = event

  // Simulate production based on priority and type
  await produce(priority, type)

  // Calculate total price
  var price = width * height * length * pricePerUnit
  if (priority <= 3) {
    price += 5
  } else {
    if (priority <= 5) {
      price += 3
    }
  }

  // Create bill object
  var bill = {
    order: order,
    tag: tag,
    pricePerUnit: pricePerUnit,
    price: price
  }

  // Call billing
  await ctx.call('publisher', {
    fun: 'billing',
    event: bill
  })

  // Respond ok
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      result: 'ok'
    })
  }
})
