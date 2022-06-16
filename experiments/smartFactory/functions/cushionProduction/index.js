const lib = require('@befaas/lib')

function produce (material, fabric) {
  return new Promise(resolve => {
    var materialValue = 1.0
    switch (material) {
      case 'A-A':
        materialValue = 1.1
        break
      case 'A-D2':
        materialValue = 1.2
        break
      case 'B-5':
        materialValue = 1.3
        break
      case 'C3':
        materialValue = 0.9
        break
      case 'D5000':
        materialValue = 0.75
        break
      default:
        materialValue = 1.0
    }

    var fabricValue = 1.0
    switch (fabric) {
      case 'CW1248':
        fabricValue = 1.1
        break
      case 'OL781':
        fabricValue = 1.2
        break
      case 'CO525':
        fabricValue = 1.3
        break
      case 'NA784':
        fabricValue = 0.9
        break
      case 'LE123':
        fabricValue = 0.75
        break
      default:
        fabricValue = 1.0
    }

    var ms = fabricValue * materialValue * 500
    console.log(`production will take ${ms} ms`)
    setTimeout(resolve, ms)
  })
}

module.exports = lib.serverless.msgHandler(async (event, ctx) => {
  console.log('event: ' + JSON.stringify(event))
  console.log('ctx: ' + JSON.stringify(ctx))

  // Parse Event
  const {
    order,
    length,
    height,
    width,
    tag,
    material,
    fabric,
    pricePerUnit
  } = event

  // Simulate production based on material and fabric
  await produce(material, fabric)

  // Calculate total price
  var price = width * height * length * pricePerUnit

  // Create bill object
  const bill = {
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
