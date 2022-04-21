const lib = require('@befaas/lib')

module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      result: 'Pudding',
    }),
  }  
})