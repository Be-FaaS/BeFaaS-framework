const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.post('/', async (ctx, next) => {
    const device = ctx.request.body
    // console.log('Device: ' + JSON.stringify(device))

    if (device.username && device.password && device.deviceName) {
      device.deviceId = lib.helper.generateRandomID()
      var user = await ctx.db.get(`user_${device.username}`)

      if (user.password === device.password) {
        if (user.devices.length < 3) {
          user.devices.push({
            deviceName: device.deviceName,
            deviceId: device.deviceId,
            authToken: lib.helper.generateRandomID()
          })

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
            error: 'Already 3 devices registered.'
          })
          ctx.status = 400
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
        error: 'username, deviceId, or authToken field missing.'
      })
      ctx.status = 400
      return
    }
  })
})
