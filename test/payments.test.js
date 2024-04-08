require('dotenv').config();
const request = require('supertest');
const getApp = require('../src/app');
const dbConnection = require('../src/dbconnection');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { setupServer } = require('msw/node');
const handlers = require('../mock/handlers');

const server = setupServer(...handlers);

describe('Payment API', () => {
  let app;
  let mongoServer;

  beforeAll(async () => {
    server.listen({ onUnhandledRequest: "bypass" });
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    process.env.MONGODB_CONNECTION_STRING = mongoUri;
    await dbConnection.connect();
    app = await getApp();
  });

  test('should accept a valid payment', async () => {
    const response = await request(app.callback()).post('/payment').send({ amount: 100 });
    expect(response.statusCode).toBe(200);
    expect(response.body.totalAmount).toBe(100);
  });

  test('should reject an invalid payment', async () => {
    const response = await request(app.callback()).post('/payment').send({ amount: 'invalid' });
    expect(response.statusCode).toBe(400);
  });

  test('should get the total amount', async () => {
    const response = await request(app.callback()).get('/payment');
    expect(response.statusCode).toBe(200);
    expect(response.body.totalAmount).toBe(100);
  });

  afterAll(async () => {
    server.close();
    await dbConnection.close();
    await mongoServer.stop();
  });
});