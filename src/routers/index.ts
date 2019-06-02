import Router from "koa-router";
import Auth from "./auth.router";
import Person from "./person.router";
import Position from "./position.router";
import Employee from "./employee.router";

const rootRouter = new Router({ prefix: '/api' });
for (const route of [Auth, Person, Position, Employee]) {
	rootRouter.use(route.routes());
}

export default rootRouter;
