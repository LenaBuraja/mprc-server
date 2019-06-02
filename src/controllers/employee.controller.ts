import { REST_STATUS } from "../constants/rest.constants";
import RestError from "../errors/RestError";
import expandEmployee from "../expand/employee.expand";
import { CreateEmployeeForm } from "../forms/employee.forms";
import knex from "../knex";
import { PERSON_REPOSITORY_ERROR } from "../repositories/person.repository";
import { IController } from "../routers/IRouter";
import { createEmployee, EMPLOYEE_SERVICE_ERROR } from "../services/employee.service";

export const createEmployeeController: IController<CreateEmployeeForm> = async ({ form }) => {
	try {
		return await knex.transaction(async (tx) => {
			const employee = await createEmployee(form, tx);
			return expandEmployee(employee, { tx });
		});
	} catch (error) {
		switch (error.message) {
			case PERSON_REPOSITORY_ERROR.NOT_FOUND:
				throw new RestError('person not found', REST_STATUS.NOT_FOUND);
			case EMPLOYEE_SERVICE_ERROR.ALREADY_EXISTS:
				throw new RestError('employee already exists', REST_STATUS.UNPROCESSABLE_ENTITY);
			default:
				throw error;
		}
	}
}
