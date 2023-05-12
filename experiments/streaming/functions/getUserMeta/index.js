const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.get('/', async (ctx, next) => {
    const request = ctx.request.body
    // console.log('Request: ' + JSON.stringify(request))

    if (request.username && request.deviceid && request.authtoken) {
      var user = await ctx.db.get(`user_${request.username}`)

      const device = user.devices.find(function (value, index, array) {
        return value.deviceid === request.deviceid
      })

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
