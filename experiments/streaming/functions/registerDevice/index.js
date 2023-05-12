const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.post('/', async (ctx, next) => {
    const device = ctx.request.body
    // console.log('Device: ' + JSON.stringify(device))

    if (device.username && device.password && device.devicename && device.deviceid) {
      var user = await ctx.db.get(`user_${device.username}`)

      if (user.password === device.password) {
        if (user.devices.length < 3) {
          user.devices.push({
            devicename: device.devicename,
            deviceid: device.deviceid,
            authtoken: lib.helper.generateRandomID()
          })

          await ctx.db.set(`user_${user.username}`, user)

          ctx.type = 'application/json'
          ctx.body = JSON.stringify({
            result: 'Created.'
          })
          ctx.status = 201
        } else {
          ctx.type = 'application/json'
          ctx.body = JSON.stringify({
            error: 'Already 3 devices registered.'
          })
          ctx.status = 400
        }
      } else {
        ctx.type = 'application/json'
        ctx.body = JSON.stringify({
          error: 'Wrong username and/or password.'
        })
        ctx.status = 401
      }
    } else {
      ctx.type = 'application/json'
      ctx.body = JSON.stringify({
        error: 'username, password, devicename, or deviceid field missing.'
      })
      ctx.status = 400
    }
  })
})
