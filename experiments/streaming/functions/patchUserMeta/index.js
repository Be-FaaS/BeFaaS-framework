const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.patch('/', async (ctx, next) => {
    const request = ctx.request.body
    // console.log('Request: ' + JSON.stringify(request))

    if (request.username && request.deviceid && request.authtoken) {
      var user = await ctx.db.get(`user_${request.username}`)

      const device = user.devices.find(e => e.deviceid == request.deviceid);

      if (device.authtoken === request.authtoken) {
        if (request.videoId && request.watchedSeconds && request.like) {
          var liked = false

          // Remove old meta entry if there is one
          const idx = user.meta.findIndex(function (value, index, array) {
            return value.videoid === request.videoid
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
            await ctx.db.set(`video_${request.videoid}`, video1)
          }
          if (request.like === false && liked === true) {
            // Remove -1 like
            const video2 = await ctx.db.get(`video_${request.videoid}`)
            video2.likes = video2.likes - 1
            await ctx.db.set(`video_${request.videoid}`, video2)
          }

          user.meta.push({
            videoid: request.videoid,
            watchedseconds: request.watchedseconds,
            like: request.like
          })

          await ctx.db.set(`user_${device.username}`, user)
          ctx.type = 'application/json'
          ctx.body = JSON.stringify({
            result: 'ok'
          })
          ctx.status = 200
        } else {
          ctx.type = 'application/json'
          ctx.body = JSON.stringify({
            error: 'Invalid patch: videoid, watchedseconds, or like field missing.'
          })
          ctx.status = 400
        }
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
