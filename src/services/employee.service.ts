import { CreateEmployeeForm } from "../forms/employee.forms";
import { Transaction } from "../knex";
import { Employee, PERSON, POSITION, EMPLOYEE, Person, Position } from "../models";
import { findPersonById, createPerson } from "../repositories/person.repository";
import { getOrCreatePosition } from "../repositories/position.repository";
import { personIsEmployee, _createEmployee } from "../repositories/employee.repository";

export enum EMPLOYEE_SERVICE_ERROR {
	ALREADY_EXISTS = 'employee.service@already_exists',
}

export type EmployeeServiceCreateResult = Omit<Employee, EMPLOYEE.PERSON | EMPLOYEE.POSITION> & {
	[EMPLOYEE.PERSON]: Person,
	[EMPLOYEE.POSITION]: Position,
};

export async function createEmployee(
	employee: CreateEmployeeForm,
	tx: Transaction,
): Promise<EmployeeServiceCreateResult> {
	const [person, position] = await Promise.all([
		Promise.resolve().then(async () => {
			if (typeof employee.person !== 'number') return await createPerson(employee.person, tx);
			const personId = employee.person as number;
			const [person] = await Promise.all([
				findPersonById(personId, tx),
				Promise.resolve().then(async () => {
					if (await personIsEmployee(personId, tx)) throw new Error(EMPLOYEE_SERVICE_ERROR.ALREADY_EXISTS);
				}),
			]);
			return person;
		}),
		getOrCreatePosition(employee.position, tx),
	]);
	const result = await _createEmployee({
		...employee,
		personId: person[PERSON.ID],
		positionId: position[POSITION.ID],
	}, tx);
	return { ...result, [EMPLOYEE.PERSON]: person, [EMPLOYEE.POSITION]: position };
}
