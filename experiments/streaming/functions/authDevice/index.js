const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.get('/', async (ctx, next) => {
    const request = ctx.request.body
    // console.log('Request: ' + JSON.stringify(request))

    if (request.username && request.password && request.deviceId) {
      var user = await ctx.db.get(`user_${request.username}`)

      if (user.password === request.password) {
        const device = user.devices.find(function (value, index, array) {
          return value.deviceId === request.deviceId
        })

        if (device) {
          ctx.type = 'application/json'
          ctx.body = JSON.stringify({
            result: 'Authorized.',
            authToken: device.authToken
          })
          ctx.status = 200
          return
        } else {
          ctx.type = 'application/json'
          ctx.body = JSON.stringify({
            error: 'DeviceId not found.'
          })
          ctx.status = 404
          return
        }
      } else {
        ctx.type = 'application/json'
        ctx.body = JSON.stringify({
          error: 'Wrong username and/or password.'
        })
        ctx.status = 401
        return
      }
    } else {
      ctx.type = 'application/json'
      ctx.body = JSON.stringify({
        error: 'username, password, or deviceId field missing.'
      })
      ctx.status = 400
      return
    }
  })
})
