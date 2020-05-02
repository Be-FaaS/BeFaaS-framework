module.exports.handler = async event => ({
    statusCode: 200,
    body: JSON.stringify({
      message: 'AWS λ',
      event
    })
})
