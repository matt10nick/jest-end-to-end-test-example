const Router = require('@koa/router');
const axios = require('axios');

const router = new Router();

router.get('/payment', async (ctx, next) => {
  try {
    const response = await axios.get(process.env.PAYMENT_API_URL);
    ctx.body = response.data;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to retrieve payment data' };
  }
});

router.post('/payment', async (ctx, next) => {
  let { amount } = ctx.request.body;
  amount = Number(amount);
  if (isNaN(amount)) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid amount' };
    return;
  }
  try {
    const response = await axios.post(process.env.PAYMENT_API_URL, { amount });
    ctx.body = response.data;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Payment processing failed' };
  }
});

module.exports = router;