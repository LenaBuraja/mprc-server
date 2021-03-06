import keccak256 = require("keccak256");
import { setPasswordPagePath } from "config";
import { randomBytes } from "crypto";
import { Transaction } from "knex";

import { PASSWORD_TOKEN_LENGTH } from "../constants/user.constants";
import { USER_ERROR } from "../errors/user.errors";
import { ExpandedEmployee } from "../expand/employee.expand";
import expandUser from "../expand/user.expand";
import { sendMail, MAIL } from "./mailer.service";
import { USER, EMPLOYEE, Person } from "../models";
import { findById, setPasswordTokenHash } from "../repositories/user.repository";

export async function giveAccess(userId: number, tx?: Transaction): Promise<{ email: string, passwordToken: Buffer }> {
	const user = await findById(userId, tx);
	if (!user) throw new Error(USER_ERROR.NOT_FOUND);
	const expandedUser = await expandUser(user, { tx });
	const employee = expandedUser[USER.EMPLOYEE] as ExpandedEmployee;
	const person = employee[EMPLOYEE.PERSON] as Person;
	const { email } = person;
	if (!email) throw new Error(USER_ERROR.HAS_NOT_EMAIL);
	const passwordToken = randomBytes(PASSWORD_TOKEN_LENGTH);
	const passwordTokenHash = keccak256(passwordToken);
	await setPasswordTokenHash(userId, passwordTokenHash, tx);
	const tokenUrl = `${setPasswordPagePath}?token=${passwordToken.toString('hex')}`;
	await sendMail(MAIL.GOT_ACCESS, email, { name: email, token_url: tokenUrl });
	return { email, passwordToken };
}
