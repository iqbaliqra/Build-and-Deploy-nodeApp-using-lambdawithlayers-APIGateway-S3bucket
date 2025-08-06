import Item from '/opt/nodejs/models/Item.js';
import sequelize from '/opt/nodejs/db.js';

export const handler = async (event) => {
  const { httpMethod, pathParameters, body } = event;

  try {
    // Check DB Connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync model
    await sequelize.sync();

    // POST: Create item
    if (httpMethod === 'POST') {
      const data = JSON.parse(body);
      const item = await Item.create(data);
      return { statusCode: 201, body: JSON.stringify(item) };
    }

    // GET: Get item by ID or all
    if (httpMethod === 'GET') {
      if (pathParameters && pathParameters.id) {
        const item = await Item.findByPk(pathParameters.id);
        return item
          ? { statusCode: 200, body: JSON.stringify(item) }
          : { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
      }
      const items = await Item.findAll();
      return { statusCode: 200, body: JSON.stringify(items) };
    }

    // PUT: Update item
    if (httpMethod === 'PUT' && pathParameters && pathParameters.id) {
      const data = JSON.parse(body);
      const [updated] = await Item.update(data, { where: { id: pathParameters.id } });
      return updated
        ? { statusCode: 200, body: JSON.stringify({ message: 'Updated successfully' }) }
        : { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
    }

    // DELETE: Remove item
    if (httpMethod === 'DELETE' && pathParameters && pathParameters.id) {
      const deleted = await Item.destroy({ where: { id: pathParameters.id } });
      return deleted
        ? { statusCode: 200, body: JSON.stringify({ message: 'Deleted successfully' }) }
        : { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
    }

    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };

  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Database connection failed' }) };
  }
};
