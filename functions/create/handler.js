import { saveJSONDataToS3, getJSONDataFromS3 } from '/opt/nodejs/s3Service.js';
import { v4 } from 'uuid';

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Parsed body:', body);

    if (!body.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Name is required' }),
      };
    }

    const data = await getJSONDataFromS3();
    const newItem = { id: v4(), name: body.name };
    data.push(newItem);
    await saveJSONDataToS3(data);

    return {
      statusCode: 201,
      body: JSON.stringify(newItem),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
