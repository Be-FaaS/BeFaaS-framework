const lib = require('@befaas/lib')
const {PubSub} = require('@google-cloud/pubsub');


module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  //null -> include all attributes; 2 -> format using 2 spaces
  console.log("Request: \n" + JSON.stringify(request, null, 2));
  console.log("Context: \n" + JSON.stringify(ctx, null, 2));
  console.log("All Vars:" +  JSON.stringify(process.env, null, 2))
  
  //Build event 
  var topicName = 'YOUR_TOPIC_NAME_OR_ID'  
  console.log("topic name is: " + topicName)
  
  var data = JSON.stringify(request.event, null, 2);
  if (data.length == 0) {
	  data = "no message"
  }
  
  const pubSubClient = new PubSub();
  
  async function publishMessage() {
    const dataBuffer = Buffer.from(data);
    try {
      const messageId = await pubSubClient
        .topic(topicNameOrId)
        .publishMessage({data: dataBuffer});
      console.log(`Message ${messageId} published.`);
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      process.exitCode = 1;
    }
  }
  publishMessage();
  
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