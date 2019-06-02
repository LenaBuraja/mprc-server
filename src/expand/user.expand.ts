import expandEmployee, {
	EmployeeExpandSettings,
	ExpandedEmployee,
	defaultEmployeeExpandingSettings
} from "./employee.expand";

import knex, { Transaction } from "../knex";
import { Employee, USER, User } from "../models";
import { findEmployeeById } from "../repositories/employee.repository";

export interface UserExpandSettings { employee?: EmployeeExpandSettings | true; }

export interface ExpandedUser extends Omit<User, USER.EMPLOYEE> {
	[USER.EMPLOYEE]: ExpandedEmployee | User[USER.EMPLOYEE];
}

const defaultUserExpandingSettings: UserExpandSettings = { employee: defaultEmployeeExpandingSettings };

export default async function expandUser(
	user: User,
	params: { settings?: UserExpandSettings, tx?: Transaction | typeof knex } = {},
): Promise<ExpandedUser> {
	const settings = params.settings || defaultUserExpandingSettings;
	const tx = params.tx || knex;
	const result = user as ExpandedUser;
	if (settings.employee && typeof user[USER.EMPLOYEE] === 'number') {
		result[USER.EMPLOYEE] = await findEmployeeById(user[USER.EMPLOYEE], tx);
		if (typeof settings.employee !== 'boolean') {
			await expandEmployee(result.employee as Employee, { settings: settings.employee, tx });
		}
	}
	return result;
}
