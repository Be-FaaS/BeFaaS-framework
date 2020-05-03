const AWS = require('aws-sdk')

module.exports.handler = async event => {
  const s3 = new AWS.S3()
  const buckets = await s3.listObjects({
    Bucket: 'faastestbed-terraform-example'
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'AWS λ',
      buckets
    }, null, 2)
  }
}


module.exports.googleHandler = (req, res) => {
  const message = req.query.message || req.body.message || 'Hello World!'
  res.status(200).send(message)
}
