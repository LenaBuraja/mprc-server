import knex, { Transaction } from "../knex";
import { POSITION, Position, TABLE } from "../models";

export async function createPosition(title: string, tx: Transaction | typeof knex = knex): Promise<Position> {
	return await tx(TABLE.POSITIONS).insert({ [POSITION.TITLE]: title }).returning('*').then((res) => res[0]);
}

export async function getOrCreatePosition(title: string, tx: Transaction | typeof knex = knex): Promise<Position> {
	const existingPosition: Position | null = await tx(TABLE.POSITIONS).select().where({ [POSITION.TITLE]: title })
		.then((res) => res[0] || null);
	return existingPosition || await createPosition(title, tx);
}

export async function getAllPositions(tx: Transaction | typeof knex = knex): Promise<Position[]> {
	return await tx(TABLE.POSITIONS).select().orderBy(POSITION.ID);
}

export async function findPositionById(id: number, tx: Transaction | typeof knex = knex): Promise<Position> {
	const result: Position | undefined = await tx(TABLE.POSITIONS).select().where({ [POSITION.ID]: id }).limit(1)
		.then((res) => res[0]);
	if (!result) throw new Error('POSITION NOT FOUND');
	return result;
}
