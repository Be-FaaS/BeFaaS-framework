const lib = require('@befaas/lib')
const {PubSub} = require('@google-cloud/pubsub');


module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  // console.log("Request: " + JSON.stringify(request));
  // console.log("Context: " + JSON.stringify(ctx));

  var topicName = request.fun

  var data = JSON.stringify(request.event, null, 2);
  if (data.length == 0) {
	  data = "no message"
  }

  const pubSubClient = new PubSub();

  async function publishMessage() {
    const dataBuffer = Buffer.from(data);
    const customAttributes = {
      contextId: ctx.contextId,
      xPair: ctx.xPair,
    };


    try {
      const messageId = await pubSubClient
        .topic(topicName)
        .publish(dataBuffer, customAttributes);
      // console.log(`Message ${messageId} published.`);
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      process.exitCode = 1;
    }
  }
  await publishMessage();

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
