import knex, { Transaction } from "../knex";
import { Employee, EMPLOYEE, Person, User, USER } from "../models";
import EmployeeRepository = require("../repositories/employee.repository");
import { findPersonById } from "../repositories/person.repository";

export interface EmployeeExpandSettings { person?: true; }

export interface ExpandedEmployee extends Omit<Employee, EMPLOYEE.PERSON> {
	[EMPLOYEE.PERSON]: Person | Employee[EMPLOYEE.PERSON];
}

const defaultEmployeeExpandingSettings: EmployeeExpandSettings = { person: true };

export async function expandEmployee(
	employee: Employee,
	params: { settings?: EmployeeExpandSettings, tx?: Transaction | typeof knex } = {},
) {
	const settings = params.settings || defaultEmployeeExpandingSettings;
	const tx = params.tx || knex;
	const result = employee as ExpandedEmployee;
	if (settings.person && typeof employee[EMPLOYEE.PERSON] === 'number') {
		result[EMPLOYEE.PERSON] = await findPersonById(employee[EMPLOYEE.PERSON], tx);
	}
	return employee;
}

export interface UserExpandSettings { employee?: EmployeeExpandSettings | true; }

export interface ExpandedUser extends Omit<User, USER.EMPLOYEE> {
	[USER.EMPLOYEE]: ExpandedEmployee | User[USER.EMPLOYEE];
}

const defaultUserExpandingSettings: UserExpandSettings = { employee: { person: true }, };

export async function expandUser(
	user: User,
	params: { settings?: UserExpandSettings, tx?: Transaction } = {},
): Promise<ExpandedUser> {
	const settings = params.settings || defaultUserExpandingSettings;
	const tx = params.tx || knex;
	const result = user as ExpandedUser;
	if (settings.employee && typeof user[USER.EMPLOYEE] === 'number') {
		result[USER.EMPLOYEE] = await EmployeeRepository.findById(user[USER.EMPLOYEE], tx);
		if (typeof settings.employee !== 'boolean') {
			await expandEmployee(result.employee as Employee, { settings: settings.employee, tx });
		}
	}
	return result;
}
