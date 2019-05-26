import Joi from "joi";

export const createEmployeeForm = Joi.object({
	person: Joi.alt([Joi.number().unsafe(false).integer().positive().required(), Joi.object({
		firstName: Joi.string().trim().required(),
		lastName: Joi.string().trim().required(),
		middleName: Joi.string().trim().default(null),
		birthday: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(null),
		email: Joi.string().email().default(null),
		phoneNumber: Joi.string().regex(/^\+[1-9]{1}[0-9]{3,14}$/).default(null),
		position: Joi.string().required(),
	})]),
	employmentDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
	wage: Joi.number().unsafe(false).integer().positive().required(),
}).required();

export interface CreateEmployeeForm {
	person: number | {
		firstName: string;
		lastName: string;
		middleName: string | null;
		birthday: string | null;
		email: string | null;
		phoneNumber: string | null;
		position: string;
	};
	employmentDate: string;
	wage: number;
}
