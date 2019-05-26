import { Transaction } from "knex";
import knex from "../knex";
import { TABLE, POSITION, Position } from "../models";

export async function getOrCreatePosition(title: string, tx?: Transaction): Promise<Position> {
	const existingPosition: Position | null = await (knex || tx).select('*')
		.from(TABLE.POSITIONS)
		.where({ [POSITION.TITLE]: title })
		.then((res) => res[0] || null);
	return existingPosition || await (knex || tx)(TABLE.POSITIONS).insert({ [POSITION.TITLE]: title }).returning('*');
}
