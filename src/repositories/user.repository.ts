/// <reference path="../../types/Omit.d.ts" />

import EmployeeRepository = require("./employee.repository");
import { REST_STATUS } from "../constants/rest.constants";
import { PASSWORD_TOKEN_LENGTH } from "../constants/user.constants";
import RestError from "../errors/RestError";
import knex from "../knex";
import { TABLE, User, USER, EMPLOYEE, PERSON, Employee } from "../models";
import { Transaction } from "knex";

export async function findById(id: number, tx?: Transaction): Promise<User | null> {
	return await (tx || knex).select().from(TABLE.USERS).where({ id }).limit(1).then((res) => res[0] || null);
}

export async function findByEmail(email: string, tx?: Transaction): Promise<User | null> {
	return await (tx || knex).select([`${TABLE.USERS}.*`])
		.from(TABLE.PEOPLE)
		.innerJoin(TABLE.EMPLOYEES, `${TABLE.PEOPLE}.${PERSON.ID}`, `${TABLE.EMPLOYEES}.${EMPLOYEE.PERSON}`)
		.innerJoin(TABLE.USERS, `${TABLE.EMPLOYEES}.${EMPLOYEE.ID}`, `${TABLE.USERS}.${USER.EMPLOYEE}`)
		.where({ [`${TABLE.PEOPLE}.${PERSON.EMAIL}`]: email })
		.limit(1)
		.then((res) => (res as any[])[0] || null);
}

export async function setPasswordTokenHash(userId: number, passwordTokenHash: Buffer, tx?: Transaction) {
	if (passwordTokenHash.length !== PASSWORD_TOKEN_LENGTH) throw new Error('invalid password token hash length');
	const userExists = await (tx || knex)(TABLE.USERS)
		.where({ [USER.ID]: userId })
		.update({ [USER.PASSWORD_TOKEN_HASH]: passwordTokenHash.toString('hex') })
		.limit(1)
		.returning(USER.ID)
		.then((res) => res.length === 1);
	if (!userExists) throw new RestError('user not found', REST_STATUS.NOT_FOUND);
}

interface UserExpandSettings {
	employee?: EmployeeRepository.EmployeeExpandSettings | true;
}

interface ExpandedUser extends Omit<User, USER.EMPLOYEE> {
	[USER.EMPLOYEE]: EmployeeRepository.ExpandedEmployee | User[USER.EMPLOYEE];
}

export const DEFAULT_EXPAND_SETTINGS: UserExpandSettings = {
	employee: { person: true },
};

export async function expand(
	user: User,
	settings: UserExpandSettings = DEFAULT_EXPAND_SETTINGS,
	tx?: Transaction,
): Promise<ExpandedUser> {
	const result = user as ExpandedUser;
	if (settings.employee) {
		result[USER.EMPLOYEE] = await EmployeeRepository.findById(user.employee, tx);
		if (typeof settings.employee !== 'boolean') {
			await EmployeeRepository.expand(result.employee as Employee, settings.employee, tx);
		}
	}
	return result;
}
