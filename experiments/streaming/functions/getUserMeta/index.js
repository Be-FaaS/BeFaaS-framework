const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.get('/', async (ctx, next) => {
    const request = ctx.request.body
    // console.log('Request: ' + JSON.stringify(request))

    if (request.username && request.deviceId && request.authToken) {
      var user = await ctx.db.get(`user_${request.username}`)

      const device = user.devices.find(function (value, index, array) {
        return value.deviceId === request.deviceId
      })

      if (device.authToken === request.authToken) {
        ctx.type = 'application/json'
        ctx.body = JSON.stringify({
          meta: user.meta
        })
        ctx.status = 200
        return
      } else {
        ctx.type = 'application/json'
        ctx.body = JSON.stringify({
          error: 'Wrong authToken.'
        })
        ctx.status = 401
        return
      }
    } else {
      ctx.type = 'application/json'
      ctx.body = JSON.stringify({
        error: 'username, deviceId, or authToken field missing.'
      })
      ctx.status = 400
      return
    }
  })
})
