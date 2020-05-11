const _ = require('lodash')
const fetch = require('node-fetch')

const endpoints = {}
try {
  const tfoutput = require('../tfoutput.json')
  endpoints.aws = _.get(tfoutput, 'aws_invoke_url.value')
  endpoints.google = _.get(tfoutput, 'google_invoke_url.value')
} catch (e) {
  console.log(e)
}

module.exports = async (provider, fn, payload) => {
  if (!endpoints[provider]) throw new Error('unknown provider')
  const res = await fetch(`${endpoints[provider]}/${fn}/call`, {
    method: 'post',
    body: JSON.stringify(payload || {}),
    headers: { 'Content-Type': 'application/json' }
  })
  return res.json()
}
