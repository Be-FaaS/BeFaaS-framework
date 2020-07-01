const lib = require('@faastermetrics/lib')
const multer = require('@koa/multer')
const Jimp = require('jimp')
const _ = require('lodash')

const upload = multer({
  storage: multer.memoryStorage()
})

const possibleObjects = [
  {
    type: 'car',
    positionx: 175,
    positiony: 75,
    boundx: 202,
    boundy: 135
  },
  {
    type: 'car',
    positionx: 34,
    positiony: 44,
    boundx: 61,
    boundy: 70
  },
  {
    type: 'car',
    positionx: 118,
    positiony: 94,
    boundx: 184,
    boundy: 124
  },
  {
    type: 'car',
    positionx: 158,
    positiony: 148,
    boundx: 186,
    boundy: 219
  },
  {
    type: 'person',
    positionx: 23,
    positiony: 141,
    boundx: 60,
    boundy: 215
  },
  {
    type: 'person',
    positionx: 168,
    positiony: 120,
    boundx: 192,
    boundy: 136
  },
  {
    type: 'person',
    positionx: 194,
    positiony: 129,
    boundx: 230,
    boundy: 155
  },
  {
    type: 'plate',
    positionx: 182,
    positiony: 151,
    boundx: 232,
    boundy: 195
  },
  {
    type: 'plate',
    positionx: 74,
    positiony: 28,
    boundx: 99,
    boundy: 82
  },
  {
    type: 'dog',
    positionx: 109,
    positiony: 53,
    boundx: 175,
    boundy: 82
  },
  {
    type: 'ball',
    positionx: 39,
    positiony: 137,
    boundx: 109,
    boundy: 170
  },
  {
    type: 'ambulance',
    positionx: 55,
    positiony: 135,
    boundx: 114,
    boundy: 175
  }
]

/**
 *
 * The objectRecognition endpoint is responsible for analysing an uploaded image
 * from the body.
 *
 * Example Payload:
 *   curl -X POST \
 *   -F "image=@/<path_to_imgfile>" \
 *   -H "Content-Type: multipart/form-data" \
 *   http://localhost:3000/
 *
 *
 * Example Response: {
 *   "objects": [
 *     {
 *       "type":"ambulance",
 *       "positionx":8,
 *       "positiony":64,
 *       "boundx":58,
 *       "boundy":121
 *     },
 *     {
 *       "type":"car",
 *       "positionx":10,
 *       "positiony":118,
 *       "boundx":85,
 *       "boundy":138
 *     }
 *   ]
 * }
 *
 */
module.exports = lib.serverless.router(async router => {
  router.post('/', upload.single('image'), async ctx => {
    const pic = await Jimp.read(ctx.file.buffer)
    // We loaded a picture successfully and parsed it.
    console.log(pic)
    const res = {
      objects: _.sampleSize(
        possibleObjects,
        _.random(0, possibleObjects.length)
      )
    }
    await ctx.lib.call('trafficStatistics', res)
    await ctx.lib.call('movementPlan', res)

    ctx.type = 'application/json'
    ctx.body = res
  })
})
