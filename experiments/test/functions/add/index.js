const lib = require('@faastermetrics/lib')

module.exports = lib.serverless.rpcHandler(
  { db: 'redis' },
  async (event, ctx) => {
    const cacheKey = `${event.a}+${event.b}`
    const result = await ctx.db.get(cacheKey)
    if (result) return { result }
    const sum = event.a + event.b
    await ctx.db.set(cacheKey, sum)
    return { result: sum }
  }
)
