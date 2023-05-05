const AWS = require("aws-sdk");
const uuid = require("uuid");

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const sitcBucket = process.env.SITCBUCKET;
const sitcTable = process.env.SITCTABLE;

exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  // Get image filename from API Gateway event
  const imageFilename = JSON.parse(event.body).imageFilename;

  // Fetch the image from S3
  const s3Params = { Bucket: sitcBucket, Key: `public/${imageFilename}` }; // Updated this line
  console.log("Fetching from S3:", sitcBucket, `public/${imageFilename}`); // Updated this line
  const s3Response = await s3.getObject(s3Params).promise();
  const imageBytes = s3Response.Body;

  // Call Amazon Rekognition to classify the image
  const rekognitionParams = {
    Image: {
      Bytes: imageBytes,
    },
    MaxLabels: 10,
  };

  const rekognitionResponse = await rekognition
    .detectLabels(rekognitionParams)
    .promise();

  // Save the classification results to DynamoDB
  const dbParams = {
    TableName: sitcTable,
    Item: {
      id: imageFilename,
      classification: rekognitionResponse.Labels,
    },
  };

  await dynamoDB.put(dbParams).promise();

  // Return a response to the API Gateway
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify({ imageId: imageFilename, Labels: rekognitionResponse.Labels }),
  };
};

