const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.patch('/', async (ctx, next) => {
    const request = ctx.request.body

    if (request.username && request.deviceId && request.authToken) {
      var user = await ctx.db.get(`user_${request.username}`)

      const device = user.devices.find(function (value, index, array) {
        return value.deviceId === request.deviceId
      })

      if (device.authToken === request.authToken) {
        if (request.videoId && request.watchedSeconds && request.like) {
          var liked = false

          // Remove old meta entry if there is one
          const idx = user.meta.findIndex(function (value, index, array) {
            return value.videoId === request.videoId
          })
          if (idx >= 0) {
            // There is an old one
            var oldMeta = user.meta[idx]
            if (oldMeta.like === true) {
              liked = true
            }
            user.meta = user.meta.slice(idx)
          }

          if (request.like === true && liked === false) {
            // Add +1 like
            const video1 = await ctx.db.get(`video_${request.videoId}`)
            video1.likes = video1.likes + 1
            await ctx.db.set(`video_${request.videoId}`, video1)
          }
          if (request.like === false && liked === true) {
            // Remove -1 like
            const video2 = await ctx.db.get(`video_${request.videoId}`)
            video2.likes = video2.likes - 1
            await ctx.db.set(`video_${request.videoId}`, video2)
          }

          user.meta.push({
            videoId: request.videoId,
            watchedSeconds: request.watchedSeconds,
            like: request.like
          })

          await ctx.db.set(`user_${device.username}`, user)

          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              result: 'ok'
            })
          }
        } else {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              error:
                'Invalid patch: videoID, watchedSeconds, or like field missing.'
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
