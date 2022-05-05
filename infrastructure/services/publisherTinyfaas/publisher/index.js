const lib = require('@befaas/lib')
const fetch = require('node-fetch')

module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  //null -> include all attributes; 2 -> format using 2 spaces
  console.log("Request: " + JSON.stringify(request));
  console.log("Context: " + JSON.stringify(ctx));
  console.log("All Vars: " +  JSON.stringify(process.env))
  
  
  var txt = JSON.stringify(request.event);
  if (txt.length == 0) {
	  txt = "no message"
  }
  var contextId = ctx.contextId;
  var xPair = ctx.xPair;
  var functionName = request.fun;
  
  console.log("txt: " + txt);
  console.log("fnName: " + functionName);
  
  try {  
    fetch(`http://ec2-18-192-21-232.eu-central-1.compute.amazonaws.com:80/${functionName}/call`, {
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
  
  console.log("Called function " + functionName);
  
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