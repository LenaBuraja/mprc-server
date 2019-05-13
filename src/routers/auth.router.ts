import Router from "koa-router";
import initRouter from "./init-router";
import { METHOD, REST_STATUS } from "../constants/rest.constants";
import koaPassport = require("koa-passport");
import { promisify } from "util";
import { User } from "../models";
import RestError from "../errors/RestError";

export = initRouter('/auth', [{
	method: METHOD.POST,
	path: '/sign-in',
	handler: async ({ ctx }) => {
		const user = await promisify((cb) => {
			koaPassport.authenticate('local', cb)(ctx, async () => {});
		})() as User | false;
		if (user === false) throw new RestError('invalid email or password', REST_STATUS.UNPROCESSABLE_ENTITY);
		ctx.login(user);
		return user;
	},
}, {
	method: METHOD.GET,
	path: '/me',
	handler: ({ user }) => user,
}]);
