const lib = require('@befaas/lib')
const eventgridClient = require("@azure/eventgrid");


module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  //null -> include all attributes; 2 -> format using 2 spaces
  console.log("Request: \n" + JSON.stringify(request));
  console.log("Context: \n" + JSON.stringify(ctx));
  console.log("All Vars:" +  JSON.stringify(process.env))
  
  var txt = JSON.stringify(request.event);
  if (txt.length == 0) {
	  txt = "no message"
  }
  var contextId = ctx.contextId;
  var xPair = ctx.xPair;
  var functionName = request.fun;
  var endpoint = process.env.AZURE_FUNCTIONS_ENDPOINT
  
  console.log("txt: " + txt);
  console.log("fnName: " + functionName);
  console.log("endpoint: " + endpoint);
  
    
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