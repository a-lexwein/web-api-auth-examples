const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2',
  endpint: 'arn:aws:dynamodb:us-west-2:521939927944',
});

var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
  TableName: 'history',
  Item: {timestamp: '2018-04-01 ' + Math.random(), name: 'hello'},
}


docClient.put(params, console.log)
