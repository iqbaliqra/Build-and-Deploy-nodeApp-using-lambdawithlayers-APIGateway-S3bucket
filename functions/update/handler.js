import { getJSONDataFromS3, saveJSONDataToS3 } from '/opt/nodejs/s3Service.js';

export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'ID is required in path parameters' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    console.log('Update request for ID:', id);
    console.log('Update body:', body);

    const data = await getJSONDataFromS3();
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `Item with id ${id} not found` }),
      };
    }

    const updatedItem = { ...data[index], ...body };
    data[index] = updatedItem;

    await saveJSONDataToS3(data);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedItem),
    };
  } catch (err) {
    console.error('Error updating item:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
