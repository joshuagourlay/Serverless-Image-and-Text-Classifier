import { Storage, API } from 'aws-amplify';

export async function uploadImage(file) {
  // Upload the image to S3
  console.log("File type:", file.type);
  console.log("File size:", file.size);

  const fileName = `${Date.now()}-${file.name}`;
  await Storage.put(fileName, file, {
    contentType: file.type,
  });

  console.log("File type:", file.type);
  console.log("File size:", file.size);

  // Call the image analysis Lambda function through API Gateway
  const apiName = 'apib961813c'; // Replace with your API name from aws-exports.js
  const path = '/image'; // Replace with your API endpoint path from aws-exports.js
  const init = {
    body: {
      imageFilename: fileName,
    },
  };
  console.log("File type:", file.type);
  console.log("File size:", file.size);

  const response = await API.post(apiName, path, init);
  console.log("File type:", file.type);
  console.log("File size:", file.size);
  console.log("Rekognition response data: ", response);
  // Return the labels
  return response.Labels ? response.Labels : [];
}
