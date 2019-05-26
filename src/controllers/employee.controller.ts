import { IController } from "../routers/IRouter";
import { CreateEmployeeForm } from "../forms/employee.forms";
import knex from "../knex";
import { User, TABLE, PERSON, Position, USER, Person, EMPLOYEE, POSITION } from "../models";
import RestError from "../errors/RestError";
import { REST_STATUS } from "../constants/rest.constants";
import { getOrCreatePosition } from "../repositories/position.repository";

export const createEmployeeController: IController<CreateEmployeeForm> = async ({ ctx, form }) => {
	return await knex.transaction(async (client) => {
		let person: Person;
		if (typeof form.person === 'number') {
			[person] = await client.select('*').from(TABLE.PEOPLE).where({ [PERSON.ID]: form.person }).limit(1);
			if (!person) throw new RestError('person not found', REST_STATUS.NOT_FOUND);
		} else {
			[person] = await client(TABLE.PEOPLE).insert({
				[PERSON.FIRST_NAME]: form.person.firstName,
				[PERSON.LAST_NAME]: form.person.lastName,
				[PERSON.MIDDLE_NAME]: form.person.middleName,
				[PERSON.BIRTHDAY]: form.person.birthday,
				[PERSON.EMAIL]: form.person.email,
				[PERSON.PHONE_NUMBER]: form.person.phoneNumber,
				[PERSON.POSITION]: await getOrCreatePosition(form.person.position, client)
					.then((res) => res[POSITION.ID]),
			}).returning('*');
		}
		const [existingEmployee] = await client.from(TABLE.EMPLOYEES)
			.select('*')
			.where({ [EMPLOYEE.PERSON]: person[PERSON.ID] })
			.limit(1);
		if (existingEmployee) throw new RestError('employee already exists', REST_STATUS.UNPROCESSABLE_ENTITY);
		return await client.into(TABLE.EMPLOYEES).insert({
			[EMPLOYEE.PERSON]: person[PERSON.ID],
			[EMPLOYEE.EMPLOYMENT_DATE]: form.employmentDate,
			[EMPLOYEE.WAGE]: form.wage,
		}).returning('*').then((res) => res[0]);
	});
}
