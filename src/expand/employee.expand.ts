import { EMPLOYEE, Employee, Person, Position } from "../models";
import knex, { Transaction } from "../knex";
import { findPersonById } from "../repositories/person.repository";
import { findPositionById } from "../repositories/position.repository";

export interface EmployeeExpandSettings { person?: true; position?: true }

export interface ExpandedEmployee extends Omit<Employee, EMPLOYEE.PERSON | EMPLOYEE.POSITION> {
	[EMPLOYEE.PERSON]: Employee[EMPLOYEE.PERSON] | Person;
	[EMPLOYEE.POSITION]: Employee[EMPLOYEE.POSITION] | Position;
}

export const defaultEmployeeExpandingSettings: EmployeeExpandSettings = { person: true, position: true };

export default async function expandEmployee(
	employee: ExpandedEmployee,
	params: { settings?: EmployeeExpandSettings, tx?: Transaction | typeof knex } = {},
) {
	const settings = params.settings || defaultEmployeeExpandingSettings;
	const tx = params.tx || knex;
	if (settings.person && typeof employee[EMPLOYEE.PERSON] === 'number') {
		employee[EMPLOYEE.PERSON] = await findPersonById(employee[EMPLOYEE.PERSON] as number, tx);
	}
	if (settings.position && typeof employee[EMPLOYEE.POSITION] === 'number') {
		employee[EMPLOYEE.POSITION] = await findPositionById(employee[EMPLOYEE.POSITION] as number, tx);
	}
	return employee;
}
