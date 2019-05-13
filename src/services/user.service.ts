import { randomBytes } from "crypto";
import { findById, expand } from "../repositories/user.repository";
import { USER_ERROR } from "../errors/user.errors";
import { USER, EMPLOYEE, Person } from "../models";
import { ExpandedEmployee } from "../repositories/employee.repository";

export async function giveAccess(userId: number) {
	const user = await findById(userId);
	if (!user) throw new Error(USER_ERROR.NOT_FOUND);
	const expandedUser = await expand(user, { employee: { person: true } });
	const employee = expandedUser[USER.EMPLOYEE] as ExpandedEmployee
	const person = employee[EMPLOYEE.PERSON] as Person;
	const { email } = person;
	if (!email) throw new Error(USER_ERROR.HAS_NOT_EMAIL);
	const token = randomBytes(32);
	
}
