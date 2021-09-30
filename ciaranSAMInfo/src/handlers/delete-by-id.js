// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.MY_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();


exports.deleteByIdHandler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    throw new Error(`deleteMethod only accept DELETE method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);
 
  // delete  from pathParameters from APIGateway because of `/{id}` at template.yml
  const id = event.pathParameters.id;
 
  // delete the item from the table
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
  var params = {
    TableName : tableName,
    Key: { id: id },
  };
  const data = await docClient.delete(params).promise();
  const item = data.Item;
 
  const response = {
    statusCode: 200,
    body: JSON.stringify(item)
  };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
