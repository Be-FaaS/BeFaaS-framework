const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.post('/', async (ctx, next) => {
    const device = ctx.request.body
    console.log('Device: ' + JSON.stringify(device))

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
              error: 'Already 3 devices registered.'
            })
          }
        }
      } else {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: 'Wrong username and/or password.'
          })
        }
      }
    } else {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'username, password, or deviceName field missing.'
        })
      }
    }
  })
})
