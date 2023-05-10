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
	  
	  if (!videos) {
        videos = []
      }
	  
      videos.push(video.videoId)
      await ctx.db.set(`videos`, videos)

      ctx.type = 'application/json'
      ctx.body = JSON.stringify({
          result: 'Created.',
          videoId: video.videoId
        })
      ctx.status = 201
      return
    } else {
      ctx.type = 'application/json'
      ctx.body = JSON.stringify({
          error: 'title, author, or duration field missing.'
        })
      ctx.status = 400
      return
    }
  })
})
