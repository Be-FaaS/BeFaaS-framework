const lib = require('@befaas/lib')

function getRandomSizeValue (max) {
  return Math.floor(Math.random() * max)
}

module.exports = lib.serverless.msgHandler(
  { db: 'redis' },
  async (event, ctx) => {
    // console.log('event: ' + JSON.stringify(event))
    // console.log('ctx: ' + JSON.stringify(ctx))

    var noOfPanels = 0
    var noOfCushions = 0

    // Parse event
    const { order, model, length, height, width, type, color, hardness } = event

    // Persist order in db
    await ctx.db.set(`${order}_main`, event)

    switch (model) {
      case 'A':
        noOfPanels = 4
        noOfCushions = 4
        break
      case 'B':
        noOfPanels = 9
        noOfCushions = 4
        break
      case 'C':
        noOfPanels = 12
        noOfCushions = 6
        break
      default:
        console.log('ERROR: Unknown model.')
    }

    // Order panels
    for (let i = 1; i <= noOfPanels; i++) {
      var panel = {
        length: getRandomSizeValue(length),
        width: getRandomSizeValue(width),
        height: getRandomSizeValue(height),
        order: order,
        tag: `panel_${i}`,
        type: type
      }

      await ctx.call('publisher', {
        fun: 'panelOrder',
        event: panel
      })

      panel.produced = false
      await ctx.db.set(`${order}_${panel.tag}`, panel)
    }

    // Order cushions
    for (let i = 1; i <= noOfCushions; i++) {
      var cushion = {
        length: getRandomSizeValue(length),
        width: getRandomSizeValue(width),
        height: getRandomSizeValue(height),
        order: order,
        tag: `cushion_${i}`,
        hardness: hardness,
        color: color
      }

      await ctx.call('publisher', {
        fun: 'cushionOrder',
        event: cushion
      })

      cushion.produced = false
      await ctx.db.set(`${order}_${cushion.tag}`, cushion)
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        result: 'ok'
      })
    }
  }
)
