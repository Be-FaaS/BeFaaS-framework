const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.post('/', async (ctx, next) => {
    const user = ctx.request.body
    // console.log('User: ' + JSON.stringify(user))

    if (user.name && user.username && user.password) {
      user.devices = []
      user.meta = []

      await ctx.db.set(`user_${user.username}`, user)

      ctx.type = 'application/json'
      ctx.body = JSON.stringify({
        result: 'Created.'
      })
      ctx.status = 201
      return
    } else {
      ctx.type = 'application/json'
      ctx.body = JSON.stringify({
        error: 'name, username, or password field missing.'
      })
      ctx.status = 400
      return
    }
  })
})
