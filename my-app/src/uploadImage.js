import { Storage, API } from 'aws-amplify';

export async function uploadImage(file) {
  // Upload the image to S3
  const fileName = `${Date.now()}-${file.name}`;
  await Storage.put(fileName, file);

  // Call the image analysis Lambda function through API Gateway
  const apiName = 'apib961813c'; // Replace with your API name from aws-exports.js
  const path = '/image'; // Replace with your API endpoint path from aws-exports.js
  const init = {
    body: {
      imageFilename: fileName,
    },
  };

  const response = await API.post(apiName, path, init);

  // Return the labels
  return response.Labels;
}
