const lib = require('@befaas/lib')

function getMaterial (hardness) {
  switch (hardness) {
    case 1:
      return 'A-A'
    case 2:
      return 'A-D2'
    case 3:
      return 'B-5'
    case 4:
      return 'C3'
    case 5:
      return 'D5000'
    default:
      return 'B-5'
  }
}

function getFabric (color) {
  switch (color) {
    case 'alabaster':
      return 'CW1248'
    case 'olive':
      return 'OL781'
    case 'coral':
      return 'CO525'
    case 'navy':
      return 'NA784'
    case 'lemon':
      return 'LE123'
    default:
      return 'CW1248'
  }
}

function getPricePerUnit (hardness, color) {
  let p = 0.0
  switch (color) {
    case 'alabaster':
      p = 1.75
      break
    case 'olive':
      p = 1.64
      break
    case 'coral':
      p = 1.24
      break
    case 'navy':
      p = 1.98
      break
    case 'lemon':
      p = 1.82
      break
    default:
      p = 2
  }

  return p + hardness / 4
}

module.exports = lib.serverless.msgHandler(async (event, ctx) => {
  // console.log('event: ' + JSON.stringify(event))
  // console.log('ctx: ' + JSON.stringify(ctx))

  // Parse Event
  const { order, length, height, width, tag, hardness, color } = event

  // Fake db call

  // Create production cushion object
  // translate hardness into material
  // translate color in fabric
  var productionCushion = {
    length: length,
    width: width,
    height: height,
    order: order,
    tag: tag,
    material: getMaterial(hardness),
    fabric: getFabric(color),
    pricePerUnit: getPricePerUnit(hardness, color)
  }

  // Call production
  await ctx.call('publisher', {
    fun: 'cushionProduction',
    event: productionCushion
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
