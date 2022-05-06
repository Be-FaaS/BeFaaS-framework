const lib = require('@befaas/lib')


module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  //null -> include all attributes; 2 -> format using 2 spaces
  console.log("Request: \n" + JSON.stringify(request));
  console.log("Context: \n" + JSON.stringify(ctx));
  console.log("All Vars:" +  JSON.stringify(process.env))
    
  //Respond ok  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      result: 'ok',
    }),
  }  
})