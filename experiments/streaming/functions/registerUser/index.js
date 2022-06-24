const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.post('/', async (ctx, next) => {
    const user = ctx.request.body

    if (user.name && user.username && user.password) {
      user.devices = []
      user.meta = []

      await ctx.db.set(`user_${user.username}`, user)

      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          result: 'Created.'
        })
      }
    } else {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'name, username, or password field missing.'
        })
      }
    }
  })
})
