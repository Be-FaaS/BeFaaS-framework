const lib = require('@befaas/lib')

function getRandomPriority () {
  return Math.floor(Math.random() * 10) + 1
}

function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function getPricePerUnit (type) {
  switch (type) {
    case 'walnut':
      return 15.72
    case 'oak':
      return 12.12
    case 'beech':
      return 10.25
    case 'birch':
      return 8.5
    default:
      return 10.0
  }
}

module.exports = lib.serverless.msgHandler(async (event, ctx) => {
  // console.log('event: ' + JSON.stringify(event))
  // console.log('ctx: ' + JSON.stringify(ctx))

  // Parse Event
  const { order, length, height, width, type, tag } = event

  // Fake db call
  await sleep(300)

  // Create production panel object
  var productionPanel = {
    length: length,
    width: width,
    height: height,
    order: order,
    tag: tag,
    type: type,
    priority: getRandomPriority(),
    pricePerUnit: getPricePerUnit(type)
  }

  // Call production
  await ctx.call('publisher', {
    fun: 'panelProduction',
    event: productionPanel
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
