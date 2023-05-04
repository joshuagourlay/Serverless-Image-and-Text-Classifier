const AWS = require("aws-sdk");
const uuid = require("uuid");

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const sitcBucket = process.env.SITCBUCKET;
const sitcTable = process.env.SITCTABLE;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    // Parse image data from API Gateway event
    const imageData = event.body;
    const imageBytes = Buffer.from(imageData, "base64");

    // Generate a unique ID for the image and save it to S3
    const imageId = uuid.v4();
    const s3Params = {
        Bucket: sitcBucket,
        Key: imageId,
        Body: imageBytes,
    };

    await s3.putObject(s3Params).promise();

    // Call Amazon Rekognition to classify the image
    const rekognitionParams = {
        Image: {
            S3Object: {
                Bucket: sitcBucket,
                Name: imageId,
            },
        },
        MaxLabels: 10,
    };

    const rekognitionResponse = await rekognition.detectLabels(rekognitionParams).promise();

    // Save the classification results to DynamoDB
    const dbParams = {
        TableName: sitcTable,
        Item: {
            id: imageId,
            classification: rekognitionResponse.Labels,
        },
    };

    await dynamoDB.put(dbParams).promise();

    // Return a response to the API Gateway
    return {
        statusCode: 200,
        // Uncomment below to enable CORS requests
        // headers: {
        //     "Access-Control-Allow-Origin": "*",
        //     "Access-Control-Allow-Headers": "*",
        // },
        body: JSON.stringify({ imageId: imageId }),
    };
};
