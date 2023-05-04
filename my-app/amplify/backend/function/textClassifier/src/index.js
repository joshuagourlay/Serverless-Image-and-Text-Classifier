const AWS = require("aws-sdk");
const uuid = require("uuid");
const comprehend = new AWS.Comprehend();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const sitcTable = process.env.SITCTABLE;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    // Parse text data from API Gateway event
    const textData = event.body;

    // Call Amazon Comprehend to classify the text
    const comprehendParams = {
        LanguageCode: "en",
        Text: textData,
    };

    const comprehendResponse = await comprehend.detectSentiment(comprehendParams).promise();

    // Generate a unique ID for the text and save the classification results to DynamoDB
    const textId = uuid.v4();
    const dbParams = {
        TableName: sitcTable,
        Item: {
            id: textId,
            classification: comprehendResponse.Sentiment,
            text: textData,
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
        body: JSON.stringify({ textId: textId }),
    };
};

