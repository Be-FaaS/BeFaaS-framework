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
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            meta: user.meta
          })
        }
      } else {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: 'Wrong authToken.'
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
          error: 'username, deviceId, or authToken field missing.'
        })
      }
    }
  })
})
