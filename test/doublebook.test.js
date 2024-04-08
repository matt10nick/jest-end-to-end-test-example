const request = require('supertest');
const getApp = require('../src/app');
const dbConnection = require('../src/dbconnection');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Test the reservations routes', () => {
  let app;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    process.env.MONGODB_CONNECTION_STRING = mongoUri;
    await dbConnection.connect();
    app = await getApp();
  });

  describe('POST /reservations', () => {
    test('should create a new reservation', async () => {
      const newReservation = { name: 'John Doe', seat: 'A1' };
      const response = await request(app.callback()).post('/reservations').send(newReservation);
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('John Doe');
      expect(response.body.seat).toBe('A1');
    });
  
    test('should create a new reservation for Vikas Roy', async () => {
      const newReservation = { name: 'Vikas Roy', seat: 'A2' };
      const response = await request(app.callback()).post('/reservations').send(newReservation);
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('Vikas Roy');
      expect(response.body.seat).toBe('A2');
    });

    test('should not create a new reservation for Sue Smith', async () => {
      const newReservation = { name: 'Sue Smith', seat: 'A1' };
      const response = await request(app.callback()).post('/reservations').send(newReservation);
      expect(response.statusCode).toBe(400);
    });

    // Add more tests for different scenarios
  });

  // Add more describe blocks for PUT and DELETE routes

  afterAll(async () => {
    await dbConnection.close();
    await mongoServer.stop();
  });
});