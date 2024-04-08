const request = require('supertest');
const getApp = require('../src/app');
const dbConnection = require('../src/dbconnection');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Creates two reservations and deletes one', () => {
  let app;
  let mongoServer;
  let reservationId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    process.env.MONGODB_CONNECTION_STRING = mongoUri;
    await dbConnection.connect();
    app = await getApp();
  });

  test('should create a new reservation', async () => {
    const newReservation = { name: 'John Doe', seat: 'A1' };
    const response = await request(app.callback()).post('/reservations').send(newReservation);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('John Doe');
    expect(response.body.seat).toBe('A1');
    reservationId = response.body._id;
  });

  test('should create a new reservation for Vikas Roy', async () => {
    const newReservation = { name: 'Vikas Roy', seat: 'A2' };
    const response = await request(app.callback()).post('/reservations').send(newReservation);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Vikas Roy');
    expect(response.body.seat).toBe('A2');
  });

  test('should delete John Doe\'s reservation', async () => {
    const response = await request(app.callback()).delete(`/reservations/${reservationId}`);
    expect(response.statusCode).toBe(204);
  });

  test('should get only Vikas Roy\'s reservation', async () => {
    const response = await request(app.callback()).get('/reservations');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Vikas Roy');
    expect(response.body[0].seat).toBe('A2');
  });

  afterAll(async () => {
    await dbConnection.close();
    await mongoServer.stop();
  });
});