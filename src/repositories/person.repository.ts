import knex, { Transaction } from "../knex";
import { Person, TABLE, PERSON } from "../models";

export async function findPersonById(id: number, tx: Transaction | typeof knex = knex): Promise<Person> {
	const result = await tx(TABLE.PEOPLE).select('*').where({ [PERSON.ID]: id }).limit(1).then((res) => res[0]);
	if (result === undefined) throw new Error('USER NOT FOUND');
	return result;
}
