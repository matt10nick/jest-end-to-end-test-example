const Router = require('@koa/router');
const { ObjectId } = require('mongodb');
const dbConnection = require('./dbconnection');
const router = new Router();

router.get('/reservations', async (ctx, next) => {
  ctx.body = await dbConnection.db.collection('reservations').find({}).toArray();
});

router.post('/reservations', async (ctx, next) => {
  const reservation = ctx.request.body;
  if (!reservation.name || !reservation.seat) {
    ctx.status = 400;
    ctx.body = { error: 'Name and seat are required' };
    return;
  }
  const existingReservation = await dbConnection.db.collection('reservations').findOne({ seat: reservation.seat });
  if (existingReservation) {
    ctx.status = 400;
    ctx.body = { error: 'Seat is already reserved' };
    return;
  }
  await dbConnection.db.collection('reservations').insertOne(reservation);
  ctx.body = reservation;
});

router.put('/reservations/:id', async (ctx, next) => {
  if (!ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid ID' };
    return;
  }
  const id = new ObjectId(ctx.params.id);
  const updatedReservation = ctx.request.body;
  if (!updatedReservation.name || !updatedReservation.seat) {
    ctx.status = 400;
    ctx.body = { error: 'Name and seat are required' };
    return;
  }
  const existingReservation = await dbConnection.db.collection('reservations').findOne({ _id: id });
  if (!existingReservation) {
    ctx.status = 404;
    ctx.body = { error: 'Reservation not found' };
    return;
  }
  const seatTaken = await dbConnection.db.collection('reservations').findOne({ seat: updatedReservation.seat, _id: { $ne: id } });
  if (seatTaken) {
    ctx.status = 400;
    ctx.body = { error: 'Seat is already reserved' };
    return;
  }
  await dbConnection.db.collection('reservations').updateOne({ _id: id }, { $set: updatedReservation });
  ctx.body = updatedReservation;
});

router.delete('/reservations/:id', async (ctx, next) => {
  if (!ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid ID' };
    return;
  }
  const id = new ObjectId(ctx.params.id);
  await dbConnection.db.collection('reservations').deleteOne({ _id: id });
  ctx.status = 204;
});

module.exports = router;

