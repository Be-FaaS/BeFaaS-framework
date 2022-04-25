const lib = require('@befaas/lib')
const aws = require("aws-sdk");

module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  //null -> include all attributes; 2 -> format using 2 spaces
  console.log("Request: \n" + JSON.stringify(request, null, 2));
  console.log("Context: \n" + JSON.stringify(ctx, null, 2));
  console.log("All Vars:" +  JSON.stringify(process.env, null, 2))
  
  //Build event  
  var arn = "arn:aws:sns:" + process.env.AWS_REGION + ":" + process.env.AWS_ID + ":befaas-" + process.env.BEFAAS_PROJECT_ID + "-function1"  
  console.log("arn is: " + arn)
  
  var sns = new aws.SNS();
  var txt = JSON.stringify(request.event, null, 2);
  if (txt.length == 0) {
	  txt = "no message"
  }
  var msg = {
    Message: txt,
    MessageAttributes: {
      'contextId': {
        DataType: 'String',
        StringValue: ctx.contextId
      },
	  'x-pair': {
        DataType: 'String',
        StringValue: ctx.xPair
      }
    },
    Subject: JSON.stringify(request.function, null, 2),
    TargetArn: arn,
  };
  
  console.log("Msg: " + JSON.stringify(msg, null, 2))
  
  //Send event to topic
  let result = await sns.publish(msg, async function(err, data) {
    if (err) {
		console.log(err, err.stack); // an error occurred
		return err;
	}
    else {
		console.log(data);           // successful response
		return data;
	}
  }).promise();
  
  console.log("Message published (or not)" + result)
  
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