const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./reservationsRoutes');
const paymentRouter = require('./paymentRoutes');

async function getApp() {
  const app = new Koa();
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(paymentRouter.routes());
  app.use(paymentRouter.allowedMethods());

  return app;
}

module.exports = getApp;