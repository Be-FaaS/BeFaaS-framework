const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.get('/', async (ctx, next) => {
    const request = ctx.request.body
    // process.stdout.write('Request: ' + JSON.stringify(request) + '\n')

    if (request.username && request.deviceid && request.authtoken) {
      var user = await ctx.db.get(`user_${request.username}`)

      const device = user.devices.find(e => e.deviceid === request.deviceid);

      if (device.authtoken === request.authtoken) {
        ctx.type = 'application/json'
        ctx.body = JSON.stringify({
          meta: user.meta
        })
        ctx.status = 200
      } else {
        ctx.type = 'application/json'
        ctx.body = JSON.stringify({
          error: 'Wrong authtoken.'
        })
        ctx.status = 401
      }
    } else {
      ctx.type = 'application/json'
      ctx.body = JSON.stringify({
        error: 'username, deviceid, or authtoken field missing.'
      })
      ctx.status = 400
    }
  })
})
