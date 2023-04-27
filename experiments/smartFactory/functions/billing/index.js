const lib = require('@befaas/lib')

module.exports = lib.serverless.msgHandler(
  { db: 'redis' },
  async (event, ctx) => {
    // console.log('event: ' + JSON.stringify(event))
    // console.log('ctx: ' + JSON.stringify(ctx))

    // Parse event
    const { order, tag, pricePerUnit, price } = event

    // Set produced field in db
    var part = await ctx.db.get(`${order}_${tag}`)
    part.produced = true
    part.price = price
    part.pricePerUnit = pricePerUnit
    await ctx.db.set(`${order}_${tag}`, part)

    // Check if all parts are produced
    var p = 1
    var totalPrice = 0
    var checkPart
    var allProduced = true
    while ((checkPart = await ctx.db.get(`${order}_panel_${p}`)) != null) {
      if (checkPart.produced === false) {
        allProduced = false
      } else {
        totalPrice = totalPrice + checkPart.price
      }
      p = p + 1
    }
    p = 1
    while ((checkPart = await ctx.db.get(`${order}_cushion_${p}`)) != null) {
      if (checkPart.produced === false) {
        allProduced = false
      } else {
        totalPrice = totalPrice + checkPart.price
      }
      p = p + 1
    }

    // Create bill and trigger Email
    if (allProduced) {
      var payment = {
        order: order,
        totalPrice: totalPrice
      }

      await ctx.call('publisher', {
        fun: 'payment',
        event: payment
      })
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
