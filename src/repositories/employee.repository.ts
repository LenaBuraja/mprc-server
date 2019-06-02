import knex, { Transaction } from "../knex";
import { Employee, EMPLOYEE, TABLE, Person } from "../models";
import { CreateEmployeeForm } from "../forms/employee.forms";

export async function findEmployeeById(id: number, tx: Transaction | typeof knex = knex): Promise<Employee> {
	return await tx(TABLE.EMPLOYEES).select().where({ [EMPLOYEE.ID]: id }).limit(1).then((res) => res[0]);
}

export async function getAllEmployees(tx: Transaction | typeof knex = knex): Promise<Employee[]> {
	return await tx(TABLE.EMPLOYEES).select().orderBy(EMPLOYEE.ID);
}

export async function findEmployeesByPersonId(
	personId: number,
	tx: Transaction | typeof knex = knex
): Promise<Person[]> {
	return await tx(TABLE.EMPLOYEES).select().where({ [EMPLOYEE.PERSON]: personId });
}

export async function personIsEmployee(personId: number, tx: Transaction | typeof knex = knex) {
	return await findEmployeesByPersonId(personId, tx).then((res) => res.length > 0);
}

export async function _createEmployee(
	employee: Omit<CreateEmployeeForm, 'person' | 'position'> & { personId: number, positionId: number },
	tx: Transaction,
): Promise<Employee> {
	return await tx(TABLE.EMPLOYEES).insert({
		[EMPLOYEE.PERSON]: employee.personId,
		[EMPLOYEE.POSITION]: employee.positionId,
		[EMPLOYEE.EMPLOYMENT_DATE]: employee.employmentDate,
		[EMPLOYEE.WAGE]: employee.wage,
	}).returning('*').then((res) => res[0]);
}
