const lib = require('@faastermetrics/lib')

const db = lib.db.connect()

module.exports = lib.serverless.rpcHandler(async (event, ctx) => {
  const cacheKey = `${event.a}+${event.b}`
  const res = await db.get(cacheKey)
  if (res) return { result: parseInt(res, 10) }
  const sum = event.a + event.b
  await db.set(cacheKey, `${sum}`)
  return { result: sum }
})
