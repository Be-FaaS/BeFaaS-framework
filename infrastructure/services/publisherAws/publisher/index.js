const lib = require('@befaas/lib')

module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  //null -> include all attributes; 2 -> format using 2 spaces
  console.log("Request: \n" + JSON.stringify(request, null, 2));
  console.log("Context: \n" + JSON.stringify(ctx, null, 2));
  
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