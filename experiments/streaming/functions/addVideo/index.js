const lib = require('@befaas/lib')

module.exports = lib.serverless.router({ db: 'redis' }, async router => {
  router.post('/', async (ctx, next) => {
    // process.stdout.write('ctx: ' + JSON.stringify(ctx) + '\n')

    const video = ctx.request.body
    // process.stdout.write('Video: ' + JSON.stringify(video) + '\n')

    if (video.title && video.author && video.duration) {
      video.videoid = lib.helper.generateRandomID()
      video.likes = 0

      await ctx.db.set(`video_${video.videoid}`, video)

      var videos = await ctx.db.get(`videos`)

	  if (!videos) {
        videos = []
      }

      videos.push(video.videoid)
      await ctx.db.set(`videos`, videos)

      ctx.type = 'application/json'
      ctx.body = JSON.stringify({
          result: 'Created.',
          videoid: video.videoid
        })
      ctx.status = 201
    } else {
      ctx.type = 'application/json'
      ctx.body = JSON.stringify({
          error: 'title, author, or duration field missing.'
        })
      ctx.status = 400
    }
  })
})
