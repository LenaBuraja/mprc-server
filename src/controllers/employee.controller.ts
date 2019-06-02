import expandEmployee from "../expand/employee.expand";
import { CreateEmployeeForm } from "../forms/employee.forms";
import knex from "../knex";
import { IController } from "../routers/IRouter";
import { createEmployee } from "../services/employee.service";

export const createEmployeeController: IController<CreateEmployeeForm> = async ({ form }) => {
	return await knex.transaction(async (tx) => {
		const employee = await createEmployee(form, tx);
		return expandEmployee(employee, { tx });
	});
}
