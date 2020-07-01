const lib = require('@faastermetrics/lib')
const multer = require('@koa/multer')
const Jimp = require('jimp')

const upload = multer({
  storage: multer.memoryStorage()
})

/**
 *
 * Tells if there currently is an emergency situation on our street.
 *
 * Example Payload:
 *
 *
 * Example Response:
 *
 *
 *
 */
module.exports = lib.serverless.router(async router => {
  router.post('/', upload.single('avatar'), async ctx => {
    const pic = await Jimp.read(ctx.file.buffer)
    // We loaded a picture successfully and parsed it.
    console.log(pic)
    ctx.status = 200
  })
})
