import { GetPeopleForm } from "../forms/person.forms";
import knex, { Transaction } from "../knex";
import { Person, TABLE, PERSON, EMPLOYEE } from "../models";

export async function getPeople(
	{ isEmployee }: GetPeopleForm,
	tx: Transaction | typeof knex = knex,
): Promise<Person[]> {
	const query = tx(TABLE.PEOPLE).select(`${TABLE.PEOPLE}.*`).orderBy(`${TABLE.PEOPLE}.${PERSON.ID}`);
	if (isEmployee === null) return await query;
	const joinParams: [string, string] = [
		`${TABLE.PEOPLE}.${PERSON.ID}`,
		`${TABLE.EMPLOYEES}.${EMPLOYEE.PERSON}`,
	];
	if (isEmployee) return await query.innerJoin(TABLE.EMPLOYEES, ...joinParams);
	return await query.leftJoin(TABLE.EMPLOYEES, ...joinParams).where({
		[`${TABLE.EMPLOYEES}.${EMPLOYEE.PERSON}`]: null,
	});
}
