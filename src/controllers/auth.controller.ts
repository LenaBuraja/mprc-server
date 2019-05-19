import keccak256 = require("keccak256");
import { SetPasswordForm } from "../forms/auth.forms";
import { IController } from "../routers/IRouter";
import knex from "../knex";
import { TABLE, USER } from "../models";

export const setPasswordController: IController<SetPasswordForm> = async ({ form }) => {
	const { password, token } = form;
	const passwordHash = keccak256(password);
	const tokenHash = keccak256(Buffer.from(token, 'hex'));
	await knex(TABLE.USERS).update({
		[USER.PASSWORD_HASH]: passwordHash.toString('hex'),
		[USER.PASSWORD_TOKEN_HASH]: null
	}).where({ [USER.PASSWORD_TOKEN_HASH]: tokenHash.toString('hex') });
	return 'ok';
}
