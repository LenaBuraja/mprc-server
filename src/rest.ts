import keccak256 = require("keccak256");
import Koa, { ParameterizedContext } from "koa";
import bodyParser from "koa-bodyparser";
import session from "koa-session";
import passport from "koa-passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";

import { REST_STATUS } from "./constants/rest.constants";
import { User, USER } from "./models";
import { findById, findByEmail } from "./repositories/user.repository";
import router from "./routers";

export async function init() {
	const app = new Koa();
	app.keys = ['super-secret-key'];
	app.use(session({}, app));
	app.use(bodyParser());
	passport.serializeUser((user: User, done) => done(null, user.id));
	passport.deserializeUser(async (id: number, done) => done(null, await findById(id) || undefined));
	passport.use(new LocalStrategy({ usernameField: 'email' }, validateAuthCreds));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(router.routes());
	app.use(handleInvalidMethod);
	const port = 3649;
	await new Promise((resolve) => app.listen(port, () => resolve()));
	console.log(`Rest started on http://localhost:${port}`);
}

const validateAuthCreds: VerifyFunction = async (email: string, password: string, done) => {
	const user = await findByEmail(email);
	// TODO: use password hash
	if (!user || user[USER.PASSWORD_HASH] !== keccak256(password).toString('hex')) done(null, false);
	else done(null, user);
};

function handleInvalidMethod(ctx: ParameterizedContext) {
	ctx.status = REST_STATUS.METHOD_NOT_ALLOWED;
	ctx.body = { status: REST_STATUS.METHOD_NOT_ALLOWED, error: 'Method not allowed' };
}
