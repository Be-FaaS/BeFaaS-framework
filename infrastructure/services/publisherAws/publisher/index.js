const lib = require('@befaas/lib')
const aws = require("aws-sdk");

module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  console.log("Request: " + JSON.stringify(request));
  console.log("Context: " + JSON.stringify(ctx));
   
  var arn = "arn:aws:sns:" + process.env.AWS_REGION + ":" + process.env.AWS_ID + ":befaas-" + process.env.BEFAAS_PROJECT_ID + "-" + request.fun
  
  var sns = new aws.SNS({apiVersion: '2010-03-31'});
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
	  'xPair': {
        DataType: 'String',
        StringValue: ctx.xPair
      }
    },
    Subject: JSON.stringify(request.fun),
    TargetArn: arn,
  };
  
  console.log("Msg: " + JSON.stringify(msg))
  
  await sns.publish(msg, function(err, data) {
    if (err) console.log(err, err.stack)
    else {
      console.log(`Message ${msg.Message} sent to the topic ${msg.TargetArn}`);
      console.log("MessageID is " + data.MessageId);
	}
  }).promise();
  
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