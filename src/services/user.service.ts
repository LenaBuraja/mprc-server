import { randomBytes } from "crypto";
import { PASSWORD_TOKEN_LENGTH } from "../constants/user.constants";
import { USER_ERROR } from "../errors/user.errors";
import { USER, EMPLOYEE, Person } from "../models";
import { ExpandedEmployee } from "../repositories/employee.repository";
import { findById, expand, setPasswordToken } from "../repositories/user.repository";
import { Transaction } from "knex";
import { sendMail, MAIL } from "./mailer.service";
import { setPasswordPagePath } from "config";

export async function giveAccess(userId: number, tx?: Transaction): Promise<{ email: string, passwordToken: Buffer }> {
	const user = await findById(userId, tx);
	if (!user) throw new Error(USER_ERROR.NOT_FOUND);
	const expandedUser = await expand(user, { employee: { person: true } }, tx);
	const employee = expandedUser[USER.EMPLOYEE] as ExpandedEmployee
	const person = employee[EMPLOYEE.PERSON] as Person;
	const { email } = person;
	if (!email) throw new Error(USER_ERROR.HAS_NOT_EMAIL);
	const passwordToken = randomBytes(PASSWORD_TOKEN_LENGTH);
	await setPasswordToken(userId, passwordToken, tx);
	const tokenUrl = `${setPasswordPagePath}?token=${passwordToken.toString('hex')}`;
	await sendMail(MAIL.GOT_ACCESS, email, { name: email, token_url: tokenUrl });
	return { email, passwordToken };
}
