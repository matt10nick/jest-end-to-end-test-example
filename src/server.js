require('dotenv').config();
const getApp = require('./app');
const dbConnection = require('./dbconnection');

async function startServer() {
  await dbConnection.connect();
  const app = await getApp();

  await new Promise(resolve => app.listen(3000, resolve));
  console.log('Server running on http://localhost:3000');

  console.log('Server has started');
}

startServer();