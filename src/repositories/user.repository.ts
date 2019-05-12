import knex from "../knex";
import { TABLE, User, USER, EMPLOYEE, PERSON } from "../models";

export async function findById(id: number): Promise<User | null> {
	return await knex.select().from(TABLE.USERS).where({ id }).limit(1).then((res) => res[0] || null);
}

export async function findByEmail(email: string): Promise<User | null> {
	console.log(knex.select(`${TABLE.USERS}.*`)
		.from(TABLE.PEOPLE)
		.innerJoin(TABLE.EMPLOYEES, `${TABLE.PEOPLE}.${PERSON.ID}`, `${TABLE.EMPLOYEES}.${EMPLOYEE.ID}`)
		.innerJoin(TABLE.USERS, `${TABLE.EMPLOYEES}.${EMPLOYEE.ID}`, `${TABLE.USERS}.${USER.EMPLOYEE_ID}`)
		.where({ [`${TABLE.PEOPLE}.${PERSON.EMAIL}`]: email })
		.limit(1).toQuery()
	);

	return await knex.select(`${TABLE.USERS}.*`)
		.from(TABLE.PEOPLE)
		.innerJoin(TABLE.EMPLOYEES, `${TABLE.PEOPLE}.${PERSON.ID}`, `${TABLE.EMPLOYEES}.${EMPLOYEE.PERSON_ID}`)
		.innerJoin(TABLE.USERS, `${TABLE.EMPLOYEES}.${EMPLOYEE.ID}`, `${TABLE.USERS}.${USER.EMPLOYEE_ID}`)
		.where({ [`${TABLE.PEOPLE}.${PERSON.EMAIL}`]: email })
		.limit(1)
		.then((res) => (res as any[])[0] || null);
}
