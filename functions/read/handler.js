// functions/read/handler.js
import { getJSONDataFromS3 } from '/opt/nodejs/s3Service.js';

export const handler = async () => {
  try {
    const data = await getJSONDataFromS3();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};
