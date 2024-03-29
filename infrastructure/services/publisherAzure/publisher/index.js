const lib = require('@befaas/lib')
const { EventGridPublisherClient, AzureKeyCredential } = require("@azure/eventgrid");

module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  //console.log("Request: " + JSON.stringify(request));
  //console.log("Context: " + JSON.stringify(ctx));

  var txt = JSON.stringify(request.event);
  if (txt.length == 0) {
	  txt = "no message";
  }

  var contextId = ctx.contextId;
  var xPair = ctx.xPair;
  var functionName = request.fun;

  const endpoints = process.env.TOPIC_ENDPOINTS.split("; ");
  const keys = process.env.ACCESS_KEYS.split("; ");

  var idx = -1;

  for (let i = 0; i < endpoints.length; i++) {
    //console.log(i.toString() + ": " + endpoints[i]  + ": " + keys[i])
	  if (endpoints[i].startsWith("https://" + functionName.toLowerCase() + ".")) {
		  idx = i;
	  }
  }

  //console.log("txt: " + txt);
  //console.log("fnName: " + functionName);
  //console.log("endpoint: " + endpoints[idx]);
  //console.log("key: " + keys[idx]);

  const client = new EventGridPublisherClient(
    endpoints[idx],
    "EventGrid",
    new AzureKeyCredential(keys[idx])
  );

  await client.send([
  {
    eventType: "Azure.SDK.Samples.CustomEvent",
    subject: functionName,
    dataVersion: "1.0",
    data: {
      event: txt,
	  contextId: contextId,
	  xPair: xPair
    }
  }
  ]);

  //console.log("published.")

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
