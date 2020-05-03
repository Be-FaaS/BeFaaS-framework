const express = require('express')
const AWS = require('aws-sdk')

const app = express()

module.exports = app

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/buckets', async (req, res) => {
  const s3 = new AWS.S3()
  const buckets = await s3.listObjects({
    Bucket: 'faastestbed-terraform-example'
  }).promise()
  res.send(buckets)
})
