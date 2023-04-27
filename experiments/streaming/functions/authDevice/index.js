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
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              result: 'Authorized.',
              authToken: device.authToken
            })
          }
        } else {
          return {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              error: 'DeviceId not found.'
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
          error: 'username, password, or deviceId field missing.'
        })
      }
    }
  })
})
