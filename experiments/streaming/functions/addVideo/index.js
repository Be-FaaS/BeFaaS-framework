const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.post('/', async (ctx, next) => {
    // console.log('ctx: ' + JSON.stringify(ctx))

    const video = ctx.request.body
    // console.log('Video: ' + JSON.stringify(video))

    if (video.title && video.author && video.duration) {
      video.videoId = lib.helper.generateRandomID()
      video.likes = 0

      await ctx.db.set(`video_${video.videoId}`, video)

      var videos = await ctx.db.get(`videos`)
      videos.push(video.videoId)
      await ctx.db.set(`videos`, videos)

      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          result: 'Created.',
          videoId: video.videoId
        })
      }
    } else {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'title, author, or duration field missing.'
        })
      }
    }
  })
})
