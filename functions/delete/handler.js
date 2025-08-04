import { getJSONDataFromS3, saveJSONDataToS3 } from '/opt/nodejs/s3Service.js';

export const handler = async (event) => {
  const id = event.pathParameters?.id;
  const data = await getJSONDataFromS3();
  const filtered = data.filter((item) => item.id !== id);

  if (filtered.length === data.length) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Not Found' }) };
  }

  await saveJSONDataToS3(filtered);
  return { statusCode: 200, body: JSON.stringify({ message: 'Deleted' }) };
};
