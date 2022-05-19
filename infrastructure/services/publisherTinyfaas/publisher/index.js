const lib = require('@befaas/lib')
const fetch = require('node-fetch')

module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  console.log("Request: " + JSON.stringify(request));
  console.log("Context: " + JSON.stringify(ctx));
  
  
  var txt = JSON.stringify(request.event);
  if (txt.length == 0) {
	  txt = "no message"
  }
  var contextId = ctx.contextId;
  var xPair = ctx.xPair;
  var functionName = request.fun;
  var endpoint = process.env.TINYFAAS_ENDPOINT
  
  //console.log("txt: " + txt);
  //console.log("fnName: " + functionName);
  //console.log("endpoint: " + endpoint);

  try {  
    fetch(`${endpoint}/${functionName}/call`, {
        method: 'post',
        body: JSON.stringify(request.event || {}),
        headers: {
          'Content-Type': 'application/json',
          'X-Context': contextId,
          'X-Pair': xPair
        }
      })
  } catch (e) {
	  console.log(e);
  }
  
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