import Router from "koa-router";
import { inspect } from "util";

import IRouter from "./IRouter";
import { REST_STATUS } from "../constants/rest.constants";
import RestError from "../errors/RestError";

export default function initRouter(prefix: string, routes: IRouter[]): Router {
	const router = new Router({ prefix });
	for (const { method, path, handler, reqParser, joi } of routes) {
		router[method](path, async (ctx) => {
			try {
				const reqParams = reqParser ? reqParser(ctx) : {};
				const { error, value: form } = joi ? joi.validate(reqParams) : { error: null, value: {} };
				if (error) throw new RestError(error.message, REST_STATUS.BAD_REQUEST);
				const result = await handler({ ctx, user: ctx.state.user || null, form });
				ctx.status = REST_STATUS.OK;
				ctx.body = { status: ctx.status, result };
			} catch (err) {
				if ((err as Error).name === RestError.NAME) {
					ctx.status = err.status;
					ctx.body = { status: ctx.status, error: err.message };
				} else {
					ctx.status = 500;
					ctx.body = { status: 500, error: 'Internal server error' };
					logInternalError(err);
				}
			}
		});
	}
	return router;
}

function logInternalError(err: any) {
	console.error('!!! INTERNAL SERVER ERROR !!!');
	console.error(err instanceof Error || typeof err !== 'object' ? err : inspect(err, false, null, true));
}
