const lib = require('@befaas/lib')

module.exports = lib.serverless.msgHandler(
  { db: 'redis' },
  async (event, ctx) => {
    console.log('event: ' + JSON.stringify(event))
    console.log('ctx: ' + JSON.stringify(ctx))

    // Parse event
    const { order, totalPrice } = event

    // Set total price for order
    const orderObject = await ctx.db.get(`${order}_main`)
    orderObject.totalPrice = totalPrice
    await ctx.db.set(`${order}_main`, orderObject)

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
