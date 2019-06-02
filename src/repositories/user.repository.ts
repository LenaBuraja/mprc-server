/// <reference path="../../types/Omit.d.ts" />

import { REST_STATUS } from "../constants/rest.constants";
import { PASSWORD_TOKEN_LENGTH } from "../constants/user.constants";
import RestError from "../errors/RestError";
import knex from "../knex";
import { TABLE, User, USER, EMPLOYEE, PERSON } from "../models";
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
