const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.get('/', async (ctx, next) => {
    const request = ctx.request.body
    // console.log('Request: ' + JSON.stringify(request))

    if (request.username && request.password && request.deviceid) {
      var user = await ctx.db.get(`user_${request.username}`)

      if (user.password === request.password) {
        const device = user.devices.find(function (value, index, array) {
          return value.deviceid === request.deviceid
        })

        // Update authToken
        device.authToken = lib.helper.generateRandomID()
        await ctx.db.set(`user_${user.username}`, user)

        if (device) {
          ctx.type = 'application/json'
          ctx.body = JSON.stringify({
            result: 'Authorized.',
            authtoken: device.authtoken
          })
          ctx.status = 200
        } else {
          ctx.type = 'application/json'
          ctx.body = JSON.stringify({
            error: 'deviceid not found.'
          })
          ctx.status = 404
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
        error: 'username, password, or deviceid field missing.'
      })
      ctx.status = 400
    }
  })
})
