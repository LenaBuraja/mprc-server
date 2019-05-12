import Router from "koa-router";
import Auth = require('./auth.router');

const rootRouter = new Router({ prefix: '/api' });
for (const route of [Auth]) {
	rootRouter.use(route.routes());
}
export default rootRouter;
