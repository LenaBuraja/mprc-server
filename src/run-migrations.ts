import { Transaction } from "knex";
import knex from "./knex";
import models = require("./models");
import { giveAccess } from "./services/user.service";
import { initialUser } from "config";

const migrations: { name: string, exec: (tx: Transaction) => Promise<void> }[] = [{
	name: 'initial',
	exec: async (tx) => {
		await tx.schema.createTable(models.TABLE.POSITIONS, (table) => {
			table.increments(models.POSITION.ID).primary();
			table.string(models.POSITION.TITLE).notNullable();
		});
		await tx.schema.createTable(models.TABLE.PEOPLE, (table) => {
			table.increments(models.PERSON.ID).primary();
			table.string(models.PERSON.FIRST_NAME).notNullable();
			table.string(models.PERSON.LAST_NAME).notNullable();
			table.string(models.PERSON.MIDDLE_NAME);
			table.date(models.PERSON.BIRTHDAY);
			table.string(models.PERSON.EMAIL);
			table.string(models.PERSON.PHONE_NUMBER);
			table.integer(models.PERSON.POSITION).references(models.POSITION.ID).inTable(models.TABLE.POSITIONS);
		});
		await tx.schema.createTable(models.TABLE.EMPLOYEES, (table) => {
			table.increments(models.EMPLOYEE.ID).primary();
			table.integer(models.EMPLOYEE.PERSON).references(models.PERSON.ID).inTable(models.TABLE.PEOPLE);
			table.date(models.EMPLOYEE.EMPLOYMENT_DATE).notNullable();
			table.integer(models.EMPLOYEE.WAGE).notNullable();
		});
		await Promise.all([
			Promise.resolve().then(async () => await tx.schema.createTable(models.TABLE.CANDIDATES, (table) => {
				table.increments(models.CANDIDATE.ID).primary();
				table.integer(models.CANDIDATE.PERSON_ID).references(models.PERSON.ID).inTable(models.TABLE.PEOPLE);
				table.integer(models.CANDIDATE.PERSONNEL_OFFICER)
					.references(models.EMPLOYEE.ID)
					.inTable(models.TABLE.EMPLOYEES);
				table.integer(models.CANDIDATE.INTERVIEWER)
					.references(models.EMPLOYEE.ID)
					.inTable(models.TABLE.EMPLOYEES);
				table.timestamp(models.CANDIDATE.INTERVIEWED_AT);
				table.enum(models.CANDIDATE.STATUS, models.CandidateStatuses, {
					enumName: models.TYPES.CANDIDATE_STATUS,
					existingType: false,
					useNative: true,
				}).notNullable().defaultTo(models.CANDIDATE_STATUS.START);
				table.integer(models.CANDIDATE.WAGE);
			})),
			Promise.resolve().then(async () => await tx.schema.createTable(models.TABLE.USERS, (table) => {
				table.increments(models.USER.ID).primary();
				table.integer(models.USER.EMPLOYEE).references(models.EMPLOYEE.ID).inTable(models.TABLE.EMPLOYEES);
				table.text(models.USER.PASSWORD_HASH);
				table.text(models.USER.PASSWORD_TOKEN_HASH);
			})),
		]);
	}
}, {
	name: 'create admin and give him access',
	exec: async (tx) => {
		const positionId: number = await tx(models.TABLE.POSITIONS)
			.insert({ [models.POSITION.TITLE]: initialUser.position } as models.Position)
			.returning(models.POSITION.ID)
			.then((res) => res[0]);
		const personId: number = await tx(models.TABLE.PEOPLE).insert({
			[models.PERSON.FIRST_NAME]: initialUser.firstName,
			[models.PERSON.LAST_NAME]: initialUser.lastName,
			[models.PERSON.EMAIL]: initialUser.email,
			[models.PERSON.POSITION]: positionId,
		} as models.Person).returning(models.PERSON.ID).then((res) => res[0]);
		const employeeId: number = await tx(models.TABLE.EMPLOYEES).insert({
			[models.EMPLOYEE.PERSON]: personId,
			[models.EMPLOYEE.EMPLOYMENT_DATE]: new Date(),
			[models.EMPLOYEE.WAGE]: 0,
		} as models.Employee).returning(models.EMPLOYEE.ID).then((res) => res[0]);
		const userId: number = await tx(models.TABLE.USERS).insert({
			[models.USER.EMPLOYEE]: employeeId,
		} as models.User).returning(models.USER.ID).then((res) => res[0]);
		await giveAccess(userId, tx);
	},
}];

export default async function runMigrations() {
	console.log('Start migration');
	const appliedMigrations = await getAppliedMigrations();
	for (const { name, exec } of migrations) {
		if (appliedMigrations.has(name)) continue;
		console.log(`Running migration "${name}"...`);
		await knex.transaction(async (tx) => {
			await exec(tx);
			await tx(models.TABLE.MIGRATIONS).insert({
				[models.MIGRATION.NAME]: name,
				[models.MIGRATION.APPLIED_AT]: new Date(),
			});
		});
	}
	console.log('All migrations has been applied');
}

async function getAppliedMigrations(): Promise<Set<string>> {
	const migrationTableExists = await knex.schema.hasTable(models.TABLE.MIGRATIONS);
	if (!migrationTableExists) {
		await knex.schema.createTable(models.TABLE.MIGRATIONS, (table) => {
			table.increments(models.MIGRATION.ID).primary();
			table.string(models.MIGRATION.NAME).notNullable();
			table.timestamp(models.MIGRATION.APPLIED_AT).notNullable();
		});
	}
	return await knex.select(models.MIGRATION.NAME).from(models.TABLE.MIGRATIONS)
		.then((res: models.Migration[]) => new Set(res.map(({ name }) => name)));
}
