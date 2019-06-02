import { EMPLOYEE, Employee, Person } from "../models";
import knex, { Transaction } from "../knex";
import { findPersonById } from "../repositories/person.repository";
import expandPerson, { PersonExpandSettings, ExpandedPerson, defaultPersonExpandSettings } from "./person.expand";

export interface EmployeeExpandSettings { person?: true | PersonExpandSettings; }

export interface ExpandedEmployee extends Omit<Employee, EMPLOYEE.PERSON> {
	[EMPLOYEE.PERSON]: Employee[EMPLOYEE.PERSON] | Person | ExpandedPerson;
}

export const defaultEmployeeExpandingSettings: EmployeeExpandSettings = { person: defaultPersonExpandSettings };

export default async function expandEmployee(
	employee: Employee | ExpandedEmployee,
	params: { settings?: EmployeeExpandSettings, tx?: Transaction | typeof knex } = {},
) {
	const settings = params.settings || defaultEmployeeExpandingSettings;
	const tx = params.tx || knex;
	if (settings.person && typeof employee[EMPLOYEE.PERSON] === 'number') {
		employee[EMPLOYEE.PERSON] = await findPersonById(employee[EMPLOYEE.PERSON] as number, tx);
		if (typeof settings.person !== 'boolean') {
			await expandPerson(employee[EMPLOYEE.PERSON] as Person, { settings: settings.person, tx });
		}
	}
	return employee;
}
