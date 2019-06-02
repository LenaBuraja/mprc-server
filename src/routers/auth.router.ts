import koaPassport = require("koa-passport");
import Router from "koa-router";
import { promisify } from "util";

import initRouter from "./init-router";
import { METHOD, REST_STATUS } from "../constants/rest.constants";
import { setPasswordController } from "../controllers/auth.controller";
import RestError from "../errors/RestError";
import { setPasswordForm } from "../forms/auth.forms";
import { User } from "../models";
import expandUser from "../expand/user.expand";

const router: Router = initRouter('/auth', [{
	method: METHOD.POST,
	path: '/set-password',
	reqParser: (ctx) => ctx.request.body,
	joi: setPasswordForm,
	handler: setPasswordController,
}, {
	method: METHOD.POST,
	path: '/sign-in',
	handler: async ({ ctx }) => {
		const user = await promisify((cb) => {
			koaPassport.authenticate('local', cb)(ctx, async () => {});
		})() as User | false;
		if (user === false) throw new RestError('invalid email or password', REST_STATUS.UNPROCESSABLE_ENTITY);
		ctx.login(user);
		return expandUser(user);
	},
}, {
	method: METHOD.GET,
	path: '/me',
	onlyAuthorized: true,
	handler: ({ user }) => expandUser(user!),
}, {
	method: METHOD.POST,
	path: '/sign-out',
	onlyAuthorized: true,
	handler: ({ ctx }) => {
		ctx.logout();
		return 'ok';
	}
}]);

export default router;
