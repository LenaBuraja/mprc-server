import knex, { Transaction } from "../knex";
import { Employee, EMPLOYEE, TABLE } from "../models";

export async function findById(id: number, tx: Transaction | typeof knex = knex): Promise<Employee> {
	return await tx(TABLE.EMPLOYEES).select().where({ [EMPLOYEE.ID]: id }).limit(1).then((res) => res[0]);
}

export async function getAllEmployees(tx: Transaction | typeof knex = knex): Promise<Employee[]> {
	return await tx(TABLE.EMPLOYEES).select().orderBy(EMPLOYEE.ID);
}
