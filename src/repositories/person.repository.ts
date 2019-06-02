import { CreatePersonForm, GetPeopleForm } from "../forms/person.forms";
import knex, { Transaction } from "../knex";
import { Person, TABLE, PERSON } from "../models";

export enum PERSON_REPOSITORY_ERROR {
	NOT_FOUND = 'person.repository@not_found',
};

export async function findPersonById(id: number, tx: Transaction | typeof knex = knex): Promise<Person> {
	const result = await tx(TABLE.PEOPLE).select('*').where({ [PERSON.ID]: id }).limit(1).then((res) => res[0]);
	if (result === undefined) throw new Error(PERSON_REPOSITORY_ERROR.NOT_FOUND);
	return result;
}

export async function createPerson(person: CreatePersonForm, tx: Transaction | typeof knex = knex): Promise<Person> {
	return await tx(TABLE.PEOPLE).insert({
		[PERSON.FIRST_NAME]: person.firstName,
		[PERSON.LAST_NAME]: person.lastName,
		[PERSON.MIDDLE_NAME]: person.middleName,
		[PERSON.BIRTHDAY]: person.birthday,
		[PERSON.EMAIL]: person.email,
		[PERSON.PHONE_NUMBER]: person.phoneNumber,
	}).returning('*').then((res) => res[0]);
}
