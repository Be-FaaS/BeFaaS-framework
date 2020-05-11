const fetch = require('node-fetch')

const endpoints = {
  aws: '',
  google: ''
}

module.exports = async (provider, fn, payload) => {
  const res = await fetch(`${endpoints[provider]}/${fn}/call`, {
    method: 'post',
    body: JSON.stringify(payload || {}),
    headers: { 'Content-Type': 'application/json' }
  })
  return res.json()
}
