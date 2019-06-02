import { Person, PERSON, Position } from "../models";
import { Transaction } from "knex";
import knex from "../knex";
import { findPositionById } from "../repositories/position.repository";

export interface PersonExpandSettings { position?: true };
export interface ExpandedPerson extends Omit<Person, PERSON.POSITION> { [PERSON.POSITION]: number | Position; }

export const defaultPersonExpandSettings: PersonExpandSettings = { position: true };

export default async function expandPerson(
	person: Person | ExpandedPerson,
	params: { settings?: PersonExpandSettings, tx?: Transaction | typeof knex } = {},
) {
	const settings = params.settings || defaultPersonExpandSettings;
	const tx = params.tx || knex;
	if (settings.position && typeof person[PERSON.POSITION] === 'number') {
		person[PERSON.POSITION] = await findPositionById(person[PERSON.POSITION] as number, tx);
	}
	return person;
}
