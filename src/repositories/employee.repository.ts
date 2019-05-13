/// <reference path="../../types/Omit.d.ts" />

import { Employee, Person, EMPLOYEE, TABLE, PERSON } from "../models";
import knex from "../knex";

export async function findById(id: number): Promise<Employee> {
	return await knex.select().from(TABLE.EMPLOYEES).where({ [EMPLOYEE.ID]: id }).limit(1).then((res) => res[0]);
}

export interface EmployeeExpandSettings {
	person?: true;
}

export interface ExpandedEmployee extends Omit<Employee, EMPLOYEE.PERSON> {
	[EMPLOYEE.PERSON]: Person | Employee[EMPLOYEE.PERSON];
}

export async function expand(employee: Employee, settings: EmployeeExpandSettings) {
	if (settings.person) {
		employee[EMPLOYEE.PERSON] = await knex.select()
			.from(TABLE.PEOPLE)
			.where({ [PERSON.ID]: employee[EMPLOYEE.PERSON] })
			.limit(1)
			.then((res) => res[0]);
	}
	return employee;
}
