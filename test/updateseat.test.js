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

  describe('Update a Reservation', () => {
    let reservationId;

    test('should create a new reservation', async () => {
      const newReservation = { name: 'John Doe', seat: 'C3' };
      const response = await request(app.callback()).post('/reservations').send(newReservation);
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('John Doe');
      expect(response.body.seat).toBe('C3');
      reservationId = response.body._id;
    });

    test('should update the reservation', async () => {
      const updatedReservation = { name: 'John Doe', seat: 'D2' };
      const response = await request(app.callback()).put(`/reservations/${reservationId}`).send(updatedReservation);
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('John Doe');
      expect(response.body.seat).toBe('D2');
    });

    test('should get the updated reservation', async () => {
      const response = await request(app.callback()).get('/reservations');
      expect(response.statusCode).toBe(200);
      const reservation = response.body.find(r => r._id === reservationId);
      expect(reservation).toBeDefined();
      expect(reservation.name).toBe('John Doe');
      expect(reservation.seat).toBe('D2');
    });

    // Add more tests for different scenarios
  });

  // Add more describe blocks for PUT and DELETE routes

  afterAll(async () => {
    await dbConnection.close();
    await mongoServer.stop();
  });

});