const AWS = require('aws-sdk')
const Router = require('@koa/router')
const router = new Router()

module.exports = router

router.get('/', (ctx, next) => {
  ctx.body = { message: 'Hello World!' }
})

router.get('/buckets', async (ctx, next) => {
  const s3 = new AWS.S3()
  ctx.body = await s3.listObjects({
    Bucket: 'faastestbed-terraform-example'
  }).promise()
})
