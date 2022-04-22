const lib = require('@befaas/lib')
const aws = require("aws-sdk");

module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  //null -> include all attributes; 2 -> format using 2 spaces
  console.log("Request: \n" + JSON.stringify(request, null, 2));
  console.log("Context: \n" + JSON.stringify(ctx, null, 2));
  
  //Build event
  console.log("All Vars:" +  JSON.stringify(process.env, null, 2))
  
  var arn = "arn:aws:sns:" + process.env.AWS_REGION + ":" + process.env.AWS_ID + ":befaas-" + process.env.BEFAAS_PROJECT_ID + "-function1"
  
  console.log("arn is: " + arn)
  
  var sns = new aws.SNS();
  var msg = {
    //Message: JSON.stringify(request.event, null, 2),
    Message: 'Some Pudding',
    MessageAttributes: {
      'context': {
        DataType: 'String',
        StringValue: JSON.stringify(ctx, null, 2)
      }
    },
    Subject: JSON.stringify(request.function, null, 2),
    TargetArn: arn,
  };
  
  console.log("Msg: " + JSON.stringify(msg, null, 2))
  
  //Send event to topic
  sns.publish(msg, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
  
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