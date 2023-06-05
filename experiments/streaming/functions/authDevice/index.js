const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  process.stdout.write('Pudding')
  router.get('/', async (ctx, next) => {
    const request = ctx.request.body
    process.stdout.write('Request: ' + JSON.stringify(request) + "\n")

    if (request.username && request.password && request.deviceid) {
      var user = await ctx.db.get(`user_${request.username}`)
      process.stdout.write('User is: ' + JSON.stringify(user) + "\n")
      if (user.password === request.password) {
        const device = user.devices.find(e => e.deviceid === request.deviceid);

        // Update authToken
        process.stdout.write('Device is: ' + JSON.stringify(device) + "\n")
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
